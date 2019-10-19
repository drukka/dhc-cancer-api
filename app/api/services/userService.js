'use strict';

const { ENCRYPTION_SALT_ROUNDS, MISC_JWT_TOKEN, EMAIL_ACTIVATION_URL, PASSWORD_RESET_URL } = require('../../config');
const { emailSender, utils } = require('../../lib');
const { sequelize, User, AuthCode, EmailActivation, PasswordResetCode, UserRole } = require('../../models');
const timeEntryService = require('./timeEntryService');

const moment = require('moment');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const findUser = where => User.findOne({ include: [UserRole], where });

const getUserByEmail = email => findUser({ email });

const getUserById = (id, transaction) => findUser({ id }, { transaction });

const updateUser = (id, data, transaction) => User.update(data, { where: { id } }, { transaction });

const userResponse = data => ({
  id: data.id,
  fullname: data.fullname,
  username: data.username,
  email: data.email,
  activated: data.activated,
  typeOfCancer: data.typeOfCancer,
  currentStage: data.currentStage,
  birthdate: moment(data.birthdate).toISOString(),
  anonymousShare: data.anonymousShare
});

const createUser = async data => {
  data.password = await bcrypt.hash(data.password, ENCRYPTION_SALT_ROUNDS);
  const user = await User.create(data);

  // emailSender.send('welcome', user.email, { firstname: user.firstname }, user.language);

  return userResponse(user);
};

const saveAuthCode = (userId, authCode) => {
  return AuthCode.create({
    userId,
    authCode
  });
};

const checkAuthCode = async (userId, authCode) => {
  const record = await AuthCode.findOne({
    where: {
      userId,
      authCode
    }
  });

  return record !== null;
};

const flushAuthCodes = (userId, excludeAuthCodes = [], transaction) => AuthCode.destroy({
  where: {
    userId,
    authCode: {
      [Op.notIn]: excludeAuthCodes
    }
  },
  transaction
});

const updateProfile = async (user, profileData) => {
  if (profileData.weight) {
    await timeEntryService.createTimeEntry(user, {
      type: 'weight',
      time: moment().toISOString(),
      weight: profileData.weight
    });
  }

  if (profileData.height) {
    await timeEntryService.createTimeEntry(user, {
      type: 'height',
      time: moment().toISOString(),
      height: profileData.height
    });
  }

  return updateUser(user.id, profileData);
};

const createEmailActivation = (userId, email, code) => EmailActivation.create({ userId, email, code });

const getEmailActivation = (userId, email, code, transaction) => EmailActivation.findOne({ where: { userId, email, code } }, { transaction });

const deleteEmailActivations = (userId, transaction) => EmailActivation.destroy({ where: { userId } }, { transaction });

const sendActivationEmail = async (user, newEmail) => {
  // create email activation code
  const activationCode = utils.generateRandomNumber(8);
  await createEmailActivation(user.id, newEmail, activationCode);

  // send activation email
  const activationToken = utils.generateJWTToken({
    userId: user.id,
    email: newEmail,
    code: activationCode,
    exp: moment().add(24, 'hours').unix()
  }, MISC_JWT_TOKEN);
  const activationUrl = `${EMAIL_ACTIVATION_URL}/${encodeURIComponent(Buffer.from(await activationToken).toString('base64'))}`;

  return emailSender.send('activation', newEmail, { firstname: user.firstname, activationUrl: activationUrl }, user.language);
};

const requestEmailChange = async (user, newEmail) => {
  if (user.email === newEmail) {
    throw new Error('DataValidationFailed');
  }

  if (await getUserByEmail(newEmail)) {
    throw new Error('Conflict');
  }

  return sendActivationEmail(user, newEmail);
};

const activateEmailAddress = async token => {
  const decoded = await utils.verifyJWTToken(Buffer.from(decodeURIComponent(token), 'base64').toString('ascii'), MISC_JWT_TOKEN);

  await sequelize.transaction(async transaction => {
    const emailActivation = await getEmailActivation(decoded.userId, decoded.email, decoded.code, transaction);

    if (!emailActivation) {
      throw new Error('NotFound');
    }

    const user = await getUserById(decoded.userId, transaction);

    user.email = decoded.email;
    user.activated = true;
    await user.save({ transaction }); // fyi: this might throw for duplicate fields

    await deleteEmailActivations(decoded.userId, transaction);
  });
};

const changePassword = async (user, oldPassword, newPassword, currentAuthCode) => {
  if (!await bcrypt.compare(oldPassword, user.password)) {
    throw new Error('IncorrectPassword');
  }

  await sequelize.transaction(async transaction => {
    await flushAuthCodes(user.id, [currentAuthCode], transaction);

    await updateUser(user.id, { password: await bcrypt.hash(newPassword, ENCRYPTION_SALT_ROUNDS) }, transaction);
  });
};

const createPasswordResetCode = (userId, code) => PasswordResetCode.create({ userId, code });

const getPasswordResetCode = (userId, code, transaction) => PasswordResetCode.findOne({ where: { userId, code } }, { transaction });

const deletePaswordResetCode = (userId, code, transaction) => PasswordResetCode.destroy({ where: { userId, code } }, { transaction });

const sendPasswordResetEmail = async email => {
  const user = await getUserByEmail(email);
  if (user) {
    // create password code
    const passwordResetCode = utils.generateRandomNumber(8);
    await createPasswordResetCode(user.id, passwordResetCode);

    // send password reset email
    const passwordResetToken = utils.generateJWTToken({
      userId: user.id,
      code: passwordResetCode,
      exp: moment().add(24, 'hours').unix()
    }, MISC_JWT_TOKEN);
    const passwordResetUrl = `${PASSWORD_RESET_URL}/${encodeURIComponent(Buffer.from(await passwordResetToken).toString('base64'))}`;

    emailSender.send('passwordReset', email, { firstname: user.firstname, passwordResetUrl: passwordResetUrl }, user.language);
  }
};

const resetPassword = async (token, newPassword) => {
  const decoded = await utils.verifyJWTToken(Buffer.from(decodeURIComponent(token), 'base64').toString('ascii'), MISC_JWT_TOKEN);

  await sequelize.transaction(async transaction => {
    const passwordResetCode = await getPasswordResetCode(decoded.userId, decoded.code, transaction);
    if (!passwordResetCode) {
      throw new Error('NotFound');
    }

    await Promise.all([
      deletePaswordResetCode(decoded.userId, decoded.code, transaction),
      flushAuthCodes(decoded.userId, transaction),
      updateUser(decoded.userId, { password: await bcrypt.hash(newPassword, ENCRYPTION_SALT_ROUNDS) }, transaction)
    ]);
  });
};

const updateProfilePicture = async (user, profilePicture) => {
  const filename = `${utils.generateHex()}.jpg`;
  await utils.saveFileFromBase64String(profilePicture, `${__dirname}/../../../uploads/profilePictures/${filename}`);

  await updateUser(user.id, { profilePicture: filename });
};

const deleteProfilePicture = user => {
  return Promise.all([
    utils.deleteFile(`${__dirname}/../../../uploads/profilePictures/${user.profilePicture}`),
    updateUser(user.id, { profilePicture: null })
  ]);
};

const listUsers = () => {
  return User.findAll();
};

module.exports = {
  createUser,
  getUserByEmail,
  saveAuthCode,
  userResponse,
  checkAuthCode,
  getUserById,
  updateProfile,
  requestEmailChange,
  activateEmailAddress,
  changePassword,
  sendPasswordResetEmail,
  resetPassword,
  sendActivationEmail,
  updateProfilePicture,
  deleteProfilePicture,
  listUsers
};
