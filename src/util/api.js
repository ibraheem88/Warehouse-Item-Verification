export const fetchData = async () => {
  const response = await fetch(
    `https://192.168.1.17:6000/users/${user.userId}`,
  );
  const data = await response.json();

  const nestedResponse = await fetch(
    `https://192.168.1.17:6000/users/${user.userId}`,
  );
  const nestedData = await nestedResponse.json();

  return {
    ...data,
    nestedData,
  };
};
