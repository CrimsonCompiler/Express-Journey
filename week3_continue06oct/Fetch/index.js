const getPersonsData = async () => {
  const response = await fetch("https://fakerapi.it/api/v1/persons");
  const finalData = await response.json();
  //   console.log(finalData);

  document.getElementById("container").innerHTML = JSON.stringify(
    finalData.data
  );
};

getPersonsData();
