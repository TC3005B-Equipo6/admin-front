export const login = async (
  email: string,
  password: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        email === "user@move360.com" &&
        password === "123456"
      ) {
        resolve("fake-token-123456");
      } else {
        reject(new Error("Credenciales inválidas"));
      }
    }, 1000);
  });
};