export const fetchData = async () => {
  const response = await fetch('https://example.com/data');
  const data = await response.json();

  const nestedResponse = await fetch(`https://example.com/data/${data.id}`);
  const nestedData = await nestedResponse.json();

  return {
    ...data,
    nestedData,
  };
};
