import crypto from 'node:crypto';

// 使用 node 的 crypto 模块进行 rsa 加密（公钥加密）
export const encryptRsaPassword = (password: string) => {
  // 将 base64 编码的公钥转换为 PEM 格式
  const publicKeyBuffer = Buffer.from(process.env.RSA_PUBLIC_KEY_BASE64 as string, 'base64');
  const publicKeyPem = publicKeyBuffer.toString('utf-8');

  // 创建公钥对象
  const publicKey = crypto.createPublicKey({
    key: publicKeyPem,
    format: 'pem',
    type: 'pkcs1',
  });

  // 使用公钥加密
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(password, 'utf-8'),
  );

  // 返回 base64 编码的加密数据
  return encryptedData.toString('base64');
};

// 使用 node 的 crypto 模块进行 rsa 解密（私钥解密）
export const decryptRsaPassword = (encryptedPassword: string) => {
  // 将 base64 编码的私钥转换为 PEM 格式
  const privateKeyBuffer = Buffer.from(process.env.RSA_PRIVATE_KEY_BASE64 as string, 'base64');
  const privateKeyPem = privateKeyBuffer.toString('utf-8');

  // 创建私钥对象
  const privateKey = crypto.createPrivateKey({
    key: privateKeyPem,
    format: 'pem',
    type: 'pkcs1',
  });

  // 使用私钥解密
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(encryptedPassword, 'base64'),
  );

  // 返回解密后的明文
  return decryptedData.toString('utf-8');
};