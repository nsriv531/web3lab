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
                    .then(playData => {
                        // Assign the fetched data to the global variable
                        data = playData;
    
                        // Populate actList and playerList from the fetched data
                        populateSelect('actList', data.acts.map(act => act.name));
                        populatePlayerList(playData.persona);
                        populateTitle(data.title);
                        populateSceneTitle(data.acts[0].scenes[0].scene.title);
                        populateSceneDirection(data.acts[0].scenes[0].scene.direction);
                    })
                    .catch(error => console.error('Error fetching play data:', error));
            }
        });
    
        function populateSceneTitle(sceneTitle) {
            titleHeading.textContent = sceneTitle;
        }

        function populateSceneDirection(sceneDirection) {
            directionHeading.textContent = sceneDirection;
        }

        // Add change event handler to actList select
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
    
        // Add change event handler to sceneList select
        sceneListSelect.addEventListener('change', function() {
            const selectedScene = sceneListSelect.value;
    
            if (selectedScene !== '0') {
                // Find the selected scene within the data
                const selectedAct = actListSelect.value; // Get the selected act
                const scene = data.acts.find(act => act.name === selectedAct)
                                     .scenes.find(scene => scene.name === selectedScene);
                const speeches = scene.speeches;
    
                // Update HTML content with fetched speeches
                updateSpeeches(speeches);
    
                // Update scene name heading
                sceneNameHeading.textContent = `Scene name: ${selectedScene}`;
            } else {
                resetSpeeches();
            }
        });

        // Function to populate the player select dropdown
        function populatePlayerList(players) {
            // Clear previous options
            playerList.innerHTML = '';
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '0';
            defaultOption.textContent = 'All Players';
            playerList.appendChild(defaultOption);
    
            // Add players
            players.forEach(player => {
                const option = document.createElement('option');
                option.value = player.player;
                option.textContent = player.player;
                playerList.appendChild(option);
            });
        }

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
    
        function updateSpeeches(speeches) {
            const sceneDiv = document.getElementById('sceneHere');
        
            // Find the existing elements within the scene
            const sceneName = sceneDiv.querySelector('h4');
            const title = sceneDiv.querySelector('.title');
            const direction = sceneDiv.querySelector('.direction');
        
            // Clear previous speeches
            sceneDiv.innerHTML = '';
        
            // Append existing elements back
            sceneDiv.appendChild(sceneName);
            sceneDiv.appendChild(title);
            sceneDiv.appendChild(direction);
        
            // Add speeches to the sceneDiv
            speeches.forEach(speech => {
                const speechDiv = document.createElement('div');
                speechDiv.classList.add('speech');
                const speakerSpan = document.createElement('span');
                speakerSpan.textContent = speech.speaker;
                speechDiv.appendChild(speakerSpan);
        
                // Create a paragraph element for each line of speech
                speech.lines.forEach(line => {
                    const lineP = document.createElement('p');
                    lineP.textContent = line;
                    speechDiv.appendChild(lineP);
                });
        
                sceneDiv.appendChild(speechDiv);
            });
        }
    
        function resetSpeeches() {
            const sceneDiv = document.getElementById('sceneHere');
    
            // Clear previous speeches
            sceneDiv.innerHTML = '';
        }
});