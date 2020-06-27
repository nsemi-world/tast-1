<article id="home" class="container-fluid m-0 p-0">
    <section class="frontpage" id="message">
        <div class="title-wrapper d-flex flex-column justify-content-center">
            <h2 class="h2 title h-auto w-auto my-auto text-light">
                <div class="logo">
                    <span>tast</span>
                    <span class="loading display-1">X</span>
                    <span>plorer</span>
                </div>
            </h2>
            <h3 class="display-3 text-center text-dark mb-5">
                <b>How much do you know about the Trans-atlantic Slave Trade?</b>
            </h3>        
        </div>
    </section>
    
    <section class="container-fluid m-0 p-0 py-5 bg-light">
        <small class="text-muted">Test yourself and take a quizz!</small>
        <div class="container row m-0 p-0 mx-auto">
            <div class="col w-100 pt-1">
                <button id="toggle-quizz" class="btn btn-success text-center w-100">exquizz me!</button>
            </div>
            <div class="col w-100 pt-1">
                <a href="participation.php" id="go-participation" class="btn btn-outline-success w-100"><i class="fas fa-crown"></i> World's Participation Map</a>
            </div>
            <div class="col w-100 pt-1">
                <a href="voyages.php" id="go-voyages" class="btn btn-outline-success w-100"><i class="fas fa-atlas"></i> Voyage Dates and Itineraries</a>
            </div>
        </div>
    </section>
    
    <section id="top-quizz" class="container-fluid py-5 bg-dark">
        <!-- HEADER WITH TITLE -->
        <div id="quizz-header" class="">
            <h3 id="quizz-title" class="h3 display-5 text-center font-weight-bold text-light"></h3>
            <div id="fb-like" class="fb-like text-center" data-href="https://tast.nsemi.org/#explore" data-layout="button_count" data-action="recommend" data-size="large" data-show-faces="true" data-share="false"></div>
        </div>


        <!-- BODY -->
        <div id="quizz-body" class="container p-3">
            <!-- SIDE MENU WITH FORM -->
            <div class="row">
                <aside id="quizz-menu" class="col rounded m-2">
                    <form id="quizz-form" class="needs-validation rounded border border-secondary shadow p-2 clearfix  text-secondary">
                        <div class="row">
                            <div class="form-group col-md-4 text-left">
                                <label for="number-of-tops" class="">Top: </label>
                                <input id="top-type" type="number" name="type" class="form-control p-1 m-0" style="heitgh: 26px;" placeholder="Top 1,2,3,..." required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                                <div class="invalid-feedback">
                                    Choose a number equal or greater than 1
                                </div>
                            </div>
                            <div class="form-group col-md-4  text-left">
                                <label for="type">Category:</label>
                                <select id="top-category" name="category" class="form-control" placeholder="Top Category:" required>
                                    <option id="option-top-countries">Top Countries</option>
                                    <option id="option-top-owners" class="d-none">Top Owners</option>
                                    <option id="option-top-captains" class="d-none">Top Captains</option>
                                    <option  id="option-top-ships" class="d-none">Top Ships</option>
                                    <option id="option-top-purchasing" class="d-none">Top Purchasing Places</option>
                                    <option id="option-top-landing" class="d-none">Top Landing Places</option>
                                </select>
                                
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div class="form-group col-md-4  text-left">
                                <label for="criteria">Criteria:</label>
                                <select id="top-criteria" name="criteria" class="form-control" required>
                                <option id="criteria-embarked"># People embarked</option>
                                <option id="criteria-disembarked" class="d-none"># People disembarked</option>
                                <option id="criteria-died" class="d-none"># People died in Middle Passage</option>
                            </select>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                        </div>
                        <button id="quizz-form-submit" type="submit" class="btn btn-outline-secondary float-right">Start</button>
                    </form>
                </aside>
                <!-- USER WORKING AREA -->
                <div id="working-area" class="col">
                    <div id="score" class="my-1 rounded  text-right">
                        <span class="badge text-secondary">Score</span>
                        <div id="score-badge" class="badge badge-info" style="padding: .4125em">
                            <span class="ncorrect">0</span> |
                            <span class="ntotal">0</span> |
                            <span class="ntries">0</span> |
                            <span class="percentage">0%
                                    </span>
                        </div>
                    </div>
                    <div id="user-area" class="rounded p-3 shadow border border-secondary">
                        <div id="user-answers" class="text-left text-secondary">
                        </div>
                        <div id="sum" class="badge w-100 text-right text-secondary my-2"></div>
                        <!-- POSSIBLE ANSWERS -->
                        <div id="possible-answers" class="container-fluid d-flex flex-wrap rounded my-3 "></div>
                        <div id="#user-actions" class="clearfix text-primary">
                            <button id="gotomenu" class="btn btn-outline-secondary" inactive>Take another quizz</button>
                            <button id="save-results" class="btn btn-outline-secondary" inactive>Save My Results</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="understand" class="container-fluid bg-success p-5">
        <div class="row">
            <h3 class="display-5 text-right col-md-6 text-light">245 Variables at your disposal.<br/>
                <small class="text-dark">
                Be sure you know their meaning and coverage.
            </small>
                <button id="go-coverage" class="btn btn-outline-secondary text-center d-none" disabled title="Comming soon...">
                Variable Meaning and Coverage
            </button>
            </h3>
            <div class="col-md-6 text-center my-auto">
                <div class="row">
                    <div class="col-lg-6 w-100 pt-1">
                        <a href="database.php" id="go-database" class="btn btn-outline-light text-center w-100"><i class="fas fa-database"></i> Look Deep into the Database</a>
                    </div>
                    <div class="col-lg-6 w-100 pt-1">
                        <a href="charts.php" id="go-charts" class="btn btn-outline-light text-center w-100"><i class="fas fa-chart-pie"></i> Put it on Charts</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--section id="home-search" class="subsection d-none">
    <div class="container" class="subsection">
        <h3 class="h3 text-center pt-5">Variable Meaning and Coverage Table</h3>
        <table id="table-meaning-coverage" class="display" style="width: 100%"></table>
    </div>
    </section-->
    <section id="contribute" class="container-fluid p-5 d-none">
        <div class="display-1 text-center my-auto">
            <p>Thank You!</p>
        </div>
        <div class="my-auto text-center my-auto">
            <i class="fas fa-heart my-auto" style="color: red;"></i>
            <button id="buy-me-a-coffee" class="btn btn-outline-secondary text-center  my-auto" disabled title="Comming Soon...">
                <i class="fas fa-coffee"></i> Buy me a Coffe</button>
            <button id="hire-me" class="btn btn-outline-secondary text-center  my-auto" disabled title="Comming Soon...">
                <i class="fas fa-coffee"></i> Hire Me!</button>
            <button id="join-us" class="btn btn-outline-secondary text-center  my-auto" disabled title="Comming Soon...">
                <i class="fab fa-facebook-square"></i> Follow us on Facebook</button>
        </div>
    </section>
</article>
