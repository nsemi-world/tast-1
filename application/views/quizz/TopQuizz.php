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
