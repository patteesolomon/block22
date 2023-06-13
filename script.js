
const PARTIES_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/parties';
const GUESTS_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/guests';
const RSVPS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/rsvps';
const GIFTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/gifts';

// guests are people who are invited to a party => not the RSVPs
// RSVPs are people who have responded to the invitation

// elements
const newPartyForm = document.querySelector('#new-party-form');
const partyContainer = document.querySelector('#party-container');
const deleteButton = document.createElement("button");

//vars to match the api
let partiesTy = []; // objs
let gTy = []; //guests
let rsvpsTy = []; // rsvps
let giftsTy = []; // gifts

const getAllGifts = async () =>
{
  try {
  const giftsResponse = await fetch(GIFTS_API_URL);
    const gifts = await giftsResponse.json();
    return gifts;
  }
  catch (er){
    console.log(er);
  }
}

const getGiftById = async (id) =>
{
  try {
    const giftapi = fetch(`${GIFTS_API_URL}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'User 1'
      })
    }).then(res => {
      return res.json();
    })
      .then(data => console.log(data))
    .catch(error => console.log('ERROR'))
    const gift = await giftapi.json();
    return gift;
  }
    catch(er)
    {
      console.log(er);
    } 
  }

const getAllRsvps = async () => {
  try {
    const rsvpsResponse = await fetch(RSVPS_API_URL);
    const rsvps = await rsvpsResponse.json();
    return rsvps;
  } catch (error) {
    console.log(error);
  }
}

const getAllGuests = async () => {
  try {
    const response = await fetch(GUESTS_API_URL);
    const guests = await response.json();
    return guests;
  } catch (error) {
    console.log(error);
  };
};

const getRsvpById = async (id) =>
{
  try {
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/${id}`);
    const rsvp = await rsvpsResponse.json();  
    return rsvp;
    } catch (error) {
      console.log(error);
    }
  }

const getGuestById = async (id) => {
  try {
    const response = await fetch(`${GUESTS_API_URL}/${id}`);
    const guest = await response.json();
    return guest;
  } catch (error) {
    console.log(error);
  };
};

/*ALWAYS AWAIT RESPONCE BEFORE INSTANTIATION*/
// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.log(error);
  };
};

// get single party by id 
// id is an object. Not a Number
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.log(error);
  };
};

// delete party
const deleteParty = async (id) => {
  console.log(id);
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`, {method:'DELETE'});
    const party = await response.json();

   //(response.formData()).delete(party) // to die
// to die
    } catch (error) {
      console.error(error);
    }
};

// render a single party by id
const renderSinglePartyById = async (id) => {
  try {

    // fetch party details from server
    const party = await getPartyById(id);
    
    // GET - /api/workshop/guests/party/:partyId - get guests by party id

    let guest = await getGuestById(id);
    gTy = await getAllGuests();
    // GET - /api/workshop/rsvps/party/:partyId - get RSVPs by partyId
    rsvpsTy = await getAllRsvps();

    // GET - get all gifts by party id - /api/workshop/parties/gifts/:partyId
    let giftsTy = await getAllGifts();
    // create new HTML element to display party details
    const partyDetailsElement = document.createElement('div');
    partyDetailsElement.appendChild
    partyDetailsElement.classList.add('party-details');
    partyDetailsElement.scrollIntoView({ behavior: 'smooth' });
    partyDetailsElement.innerHTML = `
            <h4>Party Details</h4>
             <p>${party.date}</p>
             <br>
             <p>${party.time}</p>
             <br>
             <p>${party.location}</p>
             <br>
             <p>${party.description}</p>
             <br>
              ${(guest == party) ? 
              `<h4>Guests: </h4>
                <br>
                <p>name: ${guest.name}</p>
                <br>
                <p>email: ${guest.email}</p>
                <br>
                <p>phone: ${guest.phone}</p>
                <br>
                </br>
                `:
                  `No Guests Are Comming or Invited.`
              }
             ${
      
      gTy.map(
        
          (guests, index) => `
              <li>
                <div>${guests.name}</div>
                <div>${rsvpsTy[index].status}</div>
                ${(giftsTy[index].party_id == party.id) ?
          `<div>${giftsTy[index]}</div> `:
        `<div>no gifts are given.</div>`}
              </li>
          `
        )
      .join('')
      }
          </ul>
            <button class="close-button">Close</button>
         `;
    
      const partyElement = document.createElement('div');
      partyElement.classList.add('party');
      partyElement.innerHTML = `
        <h2>${party.name}</h2>
        <button class="details-button" data-id=${party.id}>See Details</button>
        <button class="delete-button" data-id=${party.id}>Delete</button>
        <br>
        <br>
      `;
      partyContainer.appendChild(partyElement);

      // see details
      const detailsButton = partyElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        try {
          partyElement.appendChild(partyDetailsElement);
        }
        catch (error) {console.log(error);}
      });

      // delete party
    const deleteButton = partyElement.querySelector('.delete-button');

        deleteButton.addEventListener('click', async (event) => {
          deleteParty(id);
          init();
        //delete event;
      });
    // add event listener to close button
    const closeButton = partyDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      partyDetailsElement.remove();
    });
  } catch (error) {
    console.log(error);
  }
};
// render all parties
const renderParties = async (parties = []) => {
  try {
    partyContainer.innerHTML = '';
    parties.forEach(party => {
      renderSinglePartyById(party.id); // this works
    });
  } catch (error) {
    console.error(error);
  }
};

// init function
const init = async () => {
  // get all parties`
  renderParties(await getAllParties());
};

init();