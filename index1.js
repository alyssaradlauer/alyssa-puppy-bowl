//state variables
let puppies = [];
let singlePuppy;

const allPuppies = document.querySelector("#allPuppies");
const onePuppy = document.querySelector("#singlePuppy");
const addPuppyForm = document.querySelector("#addPuppyForm");

const render = () => {
  const html = puppies.map((puppy) => {
    return `
         <div>
            <h2 class="pName" data-id="${puppy.id}">${puppy.name}</h2>
         </div>
         `;
  });

  allPuppies.innerHTML = html.join("");

  if (!singlePuppy) {
    onePuppy.innerHTML = "Click on a puppy to see its stats!";
  } else {
    onePuppy.innerHTML = `
    <div>
        <h2>${singlePuppy.name}</h2>
        <h2>${singlePuppy.breed}</h2>
        <h2>${singlePuppy.status}</h2>
        <button class="playerDelete" data-id=${singlePuppy.id}>Delete Player</button>
    </div>
    `;
  }
};

//async function in order to communicate with server
const fetchPuppies = async () => {
  try {
    const response = await fetch(
      "https://fsa-puppy-bowl.herokuapp.com/api/2510-et-web-ft/players"
    );
    //convert json data into usable javascript object
    const data = await response.json();
    console.log(data.data.players);

    //update state
    puppies = data.data.players;
    render();
  } catch (error) {
    console.error(error);
  }
};

fetchPuppies();

//add event listener to allPuppies div
allPuppies.addEventListener("click", async (event) => {
  if (event.target.classList.contains("pName")) {
    const id = event.target.getAttribute("data-id") * 1;
    console.log(id);
    try {
      const response = await fetch(
        `https://fsa-puppy-bowl.herokuapp.com/api/2510-et-web-ft/players/${id}`
      );
      const data = await response.json();
      console.log(data.data.player);
      singlePuppy = data.data.player;
      render();
    } catch (error) {
      console.error(error);
    }
  }
});

addPuppyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(addPuppyForm);
  const newPuppy = {
    name: formData.get("name"),
    breed: formData.get("breed"),
    status: formData.get("status"),
    imageUrl: formData.get("imageUrl"),
    teamId: formData.get("teamId") ? Number(formData.get("teamId")) : null,
  };
  try {
    //this is a POST method
    const response = await fetch(
      "https://fsa-puppy-bowl.herokuapp.com/api/2510-et-web-ft/players",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPuppy),
      }
    );
    const data = await response.json();
    console.log(data);
    puppies.push(data.data.newPlayer);
    render();
  } catch (error) {
    console.error(error);
  }
  //think about clearing form after submitting a new guest
});

onePuppy.addEventListener("click", async (event) => {
  if (event.target.classList.contains("playerDelete")) {
    const id = event.target.getAttribute("data-id") * 1;
    console.log(id);
    try {
      const response = await fetch(
        `https://fsa-puppy-bowl.herokuapp.com/api/2510-et-web-ft/players/${id}`,
        {
          method: "DELETE",
        }
      );
      puppies = puppies.filter((puppy) => {
        return puppy.id !== id;
      });
      singlePuppy = null;
      render();
    } catch (error) {
      console.error(error);
    }
  }
});
