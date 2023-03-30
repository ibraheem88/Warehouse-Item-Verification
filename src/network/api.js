export const getCallwithoutbase = async endPoint => {
  try {
    // eslint-disable-next-line no-undef
    //// // console.log("BASE" + Constants.BASE_URL + endPoint);
    const response = await fetch(endPoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch(error => {
      throw error;
    });
    //// // console.log(response)
    const responseJSON = await response.json();
    if (responseJSON.errors) throw responseJSON.errors;
    return responseJSON;
  } catch (error) {
    throw error;
  }
};
