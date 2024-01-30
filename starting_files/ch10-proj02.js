document.addEventListener("DOMContentLoaded", function() {	
	const url = 'https://www.randyconnolly.com//funwebdev/3rd/api/shakespeare/play.php';
   /*
     To get a specific play, add play name via query string, 
	   e.g., url = url + '?name=hamlet';
	 
	 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=hamlet
	 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=jcaesar
     
   */
	 
   
    /* note: you may get a CORS error if you test this locally (i.e., directly from a
       local file). To work correctly, this needs to be tested on a local web server.  
       Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
       use built-in Live Preview.
    */
     
         // Get reference to the playList, actList, and sceneList select elements
         const playListSelect = document.getElementById('playList');
         const actListSelect = document.getElementById('actList');
         const sceneListSelect = document.getElementById('sceneList');
         const actNameHeading = document.querySelector('#actHere h3');
         const sceneNameHeading = document.querySelector('#sceneHere h4');
         const titleHeading = document.querySelector('.title p');
         const directionHeading = document.querySelector('.direction p');
         let data;
     
         // Add change event handler to playList select
         playListSelect.addEventListener('change', function() {
             // Get the selected play value from the option
             const selectedPlay = playListSelect.value;
     
             // Check if a play is selected (value is not 0)
             if (selectedPlay !== '0') {
                 // Fetch play data using the selected play as a query string
                 fetch(`${url}?name=${selectedPlay}`)
                     .then(response => response.json())
                     .then(data => {
     
                         // Populate actList from the fetched data
                         populateSelect('actList', data.acts.map(act => act.name));
                         populateSelect('playerList', data.persona.map(person => person.player));
                         populateTitle(data.title);
                         actListSelect.addEventListener('change', function() {
                            const selectedAct = actListSelect.value;
                    
                            if (selectedAct !== '0') {
                                // Filter scenes based on the selected act
                                const scenesInAct = data.acts.find(act => act.name === selectedAct).scenes;
                                // Populate sceneList with filtered scenes
                                populateSelect('sceneList', scenesInAct.map(scene => scene.name));
                    
                                actNameHeading.textContent = selectedAct;
                            } else {
                                actNameHeading.textContent = 'Act name here';
                            }
                        });
                     
                        })
                     .catch(error => console.error('Error fetching play data:', error));
             }
         });
     
         sceneListSelect.addEventListener('change', function() {
             const selectedScene = sceneListSelect.value;
     
             if (selectedScene !== '0') {
                 sceneNameHeading.textContent = selectedScene;
             } else {
                 sceneNameHeading.textContent = 'Scene name here';
             }
         });

         function populateTitle(actualTitle) {
             const h2Elements = document.getElementsByTagName('h2');
             if (h2Elements.length > 0) {
                 // Set the text content of the first h3 element to the actual title
                 h2Elements[0].textContent = actualTitle;
             } else {
                 console.log('No h2 tag found in the document.');
             }
         }
     
         // Function to populate a select element with options
         function populateSelect(selectId, options) {
             const selectElement = document.getElementById(selectId);
     
             selectElement.innerHTML = '';
     
             // Add default option
             const defaultOption = document.createElement('option');
             defaultOption.value = '0';
             defaultOption.textContent = `Choose a ${selectId.charAt(0).toUpperCase() + selectId.slice(1)}`;
             selectElement.appendChild(defaultOption);
     
             // Add options from the data
             options.forEach(option => {
                 const optionElement = document.createElement('option');
                 optionElement.value = option;
                 optionElement.textContent = option;
                 selectElement.appendChild(optionElement);
             });
         }
});