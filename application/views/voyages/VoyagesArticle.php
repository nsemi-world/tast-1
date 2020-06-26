<article id="voyages" class="container-fluid text-justify">
    <section class="container-fluid">
        <div class="frontpage">
            <div class="title-wrapper">
                <h2 class="h2 title">Voyage Itinerary</h2>
            </div>
        </div>
    </section>

    <section id="introduction" class="container my-5 p-5 shadow">
        <h3 class="h3 border-bottom">Introduction</h3>
        <div>
            <p>
                The ability to execute trans-atlantic voyages is a demanding tasks, envolving the navigation thousands of miles in open sea, with rudimentary technology and untrained crew. It takes accepting continuous life threatning and economical risks. And at an instant in time Europe developed the requirements to do it.
            </p>
            <p>
                Exploration voyages have been taking place since long time ago in human history. Polinesians developed an understanding of the Pacific that allowed them to populate an imensely sparse and distant group of islands, reaching America way before any European could have even dream about its existence. Africans, most notably Egyptians and Phoenician circum-navigated Africa centuries before Christ, and the predecessor of Mansa Musa, the renowned Imperor of Mali, is known to have abdicated his Empire to sail towards the Americas. Medieval chinese naval fleet claim having crossed and studied the Indian Ocean and reach beyound Africa, and Arabs developed instrumentation that enabled them to navigate away from the coastline and south the Equator. The point is that the oceans always worked as highways not as barriers for the mankind. Human history is an infinite migration of people around the globe, and a lot of it by sea.
            </p>
            <p>
                In the XIV century, while most of Europe was still starting defining pre-modern nations and city-states, by war and diplomatic means, Portugal at the west extreme of Europe enjoyed peace after a rapid and well succeeded wars, of political and religious campaigns against the African Moors, the Arabs and Jews, with whoom the iberian christians had lived cooperative and peacefully in the first millenium, was finally ready go discover by themselves what was hidden beyond the south horizon. A the end of the XIV century Portugal ships had already docked in the islands Azores and Madeira, found it's way to Brasil and India, and the time would take them to reach as far as Japan. It is an undeniable portuguese achievement, to be the first European many cultures and civilizations from Africa, the Americas and Asia had contact with.
            </p>
            <p>
                Unforunately, what could have started as exploration voyages, ended in tragedy. For which historical reasons I do not know, but the encounter of Portuguese and Africans in African soil proved to be a humanitary disaster and the beginning of a 500 years history of genocide and the main contributor for the today's racism against people of African descent.
            </p>
            <p>
                I am portuguse. I am so sorry for the atrocities documented in the Voyages Database. My family name is Caldeira, and I apologize for my relatives who participated in the voyages; the name Caldeira appears both as captains and owners of slave voyages. On the other side, I am also african, from Angola. Ironically, I am part portuguese, the country with a stronger impact in the slave trade, and part angolan, the region that had more people enslaved. But I don't believe on patriotisms, nationalisms or anything kind of <i>-isms</i>. I clearly denounce the injustice of the slave trade, the inhumanity of colonialism and the prevalence of racism towards african people world-wide. This is unfair and unjust. My nation is Humanity and it is as a member of this nation where you too belong, that I invite you to explore the Voyages database data in a non-linear manner.
            </p>
        </div>
    </section>
    <section id="itineraries-dashboard" class="container my-5 p-5 shadow rounded">
        <h3 class="h3 border-bottom">Voyage Details</h3>
        <p>
            Below you can use the player to cycle over the all voyages, and each voyage stage. The user interface is composed by two parts: the map give us the geographical context of te current voyage; the details section exposes some database variables with specific data for the current voyage. By clicking in a link in the details section, you will be querying the database for a new subset of voyages, those that have the same value that you clicked. For example if you click in the name of a captain, you will get all voyages where that captain is present. If you click on a ship name, you will get all voyages made by a ship with that name; and so on. With a click around a date you will get all voyages that occurred before or after that date.
        </p>
        <div class="my-5">
            <div id="vplayer" class="container-fluid text-right bg-dark sticky-top p-2">
                <div class="btn-group">
                    <button id="vprev" class="btn btn-sm btn-outline-warning fas fa-angle-left"></button>
                    <button id="vnext" class="btn btn-sm btn-outline-warning fas fa-angle-right"></button>
                    <button id="vplay" class="btn btn-sm btn-outline-warning fas fa-play"></button>
                    <button id="vpause" class="btn btn-sm btn-outline-warning fas fa-pause"></button>
                </div>
            </div>
            <div class="container-fluid">
                <div id="storymap-container" class="bg-dark shadow">
                    <div id="storymap"></div>
                </div>
                <div id="details" class="bg-dark text-light small shadow container">
                    <div class="row">
                        <div id="d-info" class="col-md-6 bg-info shadow">
                            <div class="card-text text-light"></div>
                        </div>
                        <div id="d-outcome" class="col-md-6 bg-secondary shadow">
                            <div class="card-text text-light"></div>
                        </div>
                        <div id="d-ownership" class="col-md-6 bg-danger shadow">
                            <div class="card-text text-light"></div>
                        </div>
                        <div id="d-numbers" class="col-md-6 bg-success shadow">
                            <div class="card-text text-light"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</article>
