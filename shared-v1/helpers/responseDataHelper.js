const responseData = (status, message, error, data) => {
  if (error !== null && error instanceof Error) {
    const response = {
      status,
      message: error.message,
      errors: error,
      data: null
    };
    return response;
  }

  const response = {
    status,
    message,
    errors: error,
    data
  };
  return response;
};

module.exports = { responseData };
