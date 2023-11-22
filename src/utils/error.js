// status 코드와 error 메세지를 입력하면 에러를 던져주는 함수
const error = (statusCode, message) => {
    const err = new Error (message)
    err.statusCode = statusCode
    throw error
}

const throwError = (code, message) => {
    const error = new Error(message);
    error.status = code;
    throw error;
  };
  
  module.exports = {
    throwError, error
  }
