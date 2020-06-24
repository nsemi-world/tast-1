<article id="charts" class="container-fluid text-justify">
    <section class="frontpage">
        <div class="title-wrapper">
            <h2 class="h2 title">Charts</h2>
        </div>
    </section>
    <section id="introduction" class="container my-5 p-5 shadow">
        <h3 class="h3 border-bottom">Introduction</h3>
        <div>
            <p>Charts are helpful to represent data in a concise way and allow us to perceive data properties, and relationships between variables. For instance, charts showing the number of people embarked per voyage, per year, per country, per ship, per owner, per captain, etc..., can give us an important window into the data.</p>
            <p>The main difference between these functions it's their domain. On the first case the domain is the set of distinct years of the trans-atlantic slave trade; on the second case, the set of distinct countries that made slave voyages. On both cases, we collect the number of slaves on each year or country, sum them and plot the totals. In theory, we could take any variable, calculte it's domain, collect and sum the number of people embarked for each distinct value of the domain, and plot it.</p>
            <p>In this article we provide a charting tool for the Voyages Database. To start with, let us predefine a set of simple single variable functions to plot with <b>Chart.js</b>. From here we will progressively improve our charting tool. Feel free to use the charting tools below, see what works and sense their limitations.</p>
        </div>
    </section>
    <section id="voyage-charts" class="container my-5 p-5 shadow">
        <h3 class="h3 border-bottom">Basic Charting Tool with Predefined Charts</h3>
        <div>
            <p>This basic charting tool allows you to choose a function of a single variable to plot. Plotted data requires a x-Axis where data is grouped by distinct values some variable. Finally you can choose a chart type that fits the data you want to see.</p>
        </div>
        <div id="charts-dashboard" class="my-5">
            <div id="cplayer" class="container sticky-top shadow d-block bg-dark border border-secondary">
                <form class="form row text-secondary p-3">
                    <div class="col-4">
                        <select id="select-charts-function" class="bg-dark btn btn-sm btn-outline-secondary w-100">
                        <option value="COUNT(voyageid)" class="active">Total Number of Voyages</option>
                        <option value="SUM(slaximp)">Total Number of People Embarked</option>
                        <option value="SUM(slamimp)">Total Number of People Disembarked</option>
                        <option value="SUM(slaximp)-SUM(slamimp)">Total Number of People Died Middle Passage</option>
                        <option value="COUNT(DISTINCT(shipname))">Total Number of Ships</option>
                    </select>
                    </div>
                    <div class="col-4">
                        <select id="select-charts-groupby" class="bg-dark btn btn-sm btn-outline-secondary w-100">
                    <option value="voyageid">Per Voyage</option>
                    <option value="yeardep"  class="active">Per Year</option>
                    <option value="national">Per Country</option>
                    <option value="natinimp">Per Country Imputed</option>
                    <option value="ownera">Per Owner</option>
                    <!--option>Per Departure Place</option>
                    <option>Per Departure Region</option>
                    <option>Per Purchase/Embarkation Place</option>
                    <option>Per Purchase/Embarkation Region</option>
                    <option>Per Landing/Disembarkation Place</option>
                    <option>Per Landing/Disembarkation Region</option>
                    <option>Per Ship</option>
                    <option>Per Rig</option>
                    <option>Per Ship Construction Place</option-->
                </select>
                    </div>
                    <div class="col-4">
                        <select id="select-charts-type" class="bg-dark btn btn-sm btn-outline-secondary w-100">
                        <option value="bar"  class="active">Bar</option>
                        <option value="pie">Pie</option>
                        <option value="doughnut">Doughnut</option>
                        <option value="line">Line</option>
                    </select>
                    </div>
                </form>
            </div>
            <div class="text-center text-light bg-danger">
                <var class="mx-auto"><b>
                 f(x) = <span class="formula-function"></span> | 
                         v in V 
                         <span class="text-secondary">and </span> 
                         v.<span class="formula-domain-variable"></span> = x</b>
                 </var>
            </div>
            <div id="chart-wrapper" class="shadow">
                <figure>
                    <canvas id="chart" class="bg-dark w-100 p-3"></canvas>
                    <figcaption class="chart-caption text-secondary"></figcaption>
                </figure>
            </div>
        </div>
    </section>
    <section id="voyage-charts-improvement-1" class="container my-5 p-5 shadow">
        <h3 class="h3 border-bottom">Improvement 1: Separate Function from Arguments</h3>
        <div>
            <p>We can improve this tool by separating the function from the domain variable. We gain in flexibility and in possible increased chart possibilites from the combination of number of functions by the number of variables. For instance, it will be possible to chart not only the sum of a certain measure, but also it's maximum, minimum, average, etc... Functions can grow and be added independently. A possible drawback is that it also pushes more responsability to the user side. The user must decide what makes sense to plot since not all combinations of functions and variables are meaningful. It makes no sence to add voyage ids; counting them does.</p>
            <p>Functions are defined their domain, codomain and and expression that applied to elements of the domain produce a value from the codomain. Let's start with the following functions: <var class="text-muted">COUNT, COUNT DISTINCT, MAX, MIN, SUM</var>. Here some examples:</p>
            <ul>
                <li><var class="text-muted">COUNT(voyageid)</var> - count the number of records with a defined voyageid</li>
                <li><var class="text-muted">MAX(yeardep)</var> - latest departure date in a set of voyages</li>
                <li><var class="text-muted">MIN(slaximp)</var> - earliest departure date in a set of voyages</li>
                <li><var class="text-muted">SUM(slaximp)</var> - total number of people embarked in a set of voyages</li>
                <li><var class="text-muted">COUNT(DISTINCT(shipname))</var> - return the total number of distinct shipnames</li>
            </ul>
        </div>
        <div id="charts-dashboard-improved" class="my-5">
            <div id="cplayer1" class="container sticky-top shadow py-3 pl-2 d-block bg-dark border-bottom border-secondary">
                <form class="form text-secondary">
                    <div class="row">
                        <div class="col-auto">
                            <select id="charts-function" class="bg-dark btn btn-sm btn-outline-secondary w-100">
                                <option value="COUNT" class="active">COUNT</option>
                                <option value="DISTINCT">DISTINCT</option>
                                <option value="MAX">MAX</option>
                                <option value="MIN">MIN</option>
                                <option value="SUM">SUM</option>
                            </select>
                        </div>
                        <div class="col-3">
                            <select id="function-argument" class="bg-dark btn btn-sm btn-outline-secondary w-100">
                        </select>
                        </div>
                        <div class="col-3">
                            <select id="function-groupby-variable" class="bg-dark btn btn-sm btn-outline-secondary w-100">
                            </select>
                        </div>
                        <div class="col-auto">
                            <select id="orderby" class="bg-dark btn btn-sm btn-outline-secondary w-100">
                            <option value="xASC" class="active">x ASC</option>
                            <option value="xDESC">x DESC</option>
                            <option value="fxASC">fx ASC</option>
                            <option value="fxDESC">fx DESC</option>
                            </select>
                        </div>
                        <div class="col-auto">
                            <select id="charts-type" class="bg-dark btn btn-sm btn-outline-secondary w-100">
                        <option value="bar" class="active">Bar</option>
                        <option value="pie">Pie</option>
                        <option value="doughnut">Doughnut</option>
                        <option value="line">Line</option>
                    </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="text-center text-light bg-danger">
                <var class="mx-auto"><b>
                 f(x) = <span class="formula-function"></span> | 
                         v in V 
                         <span class="text-secondary">and </span> 
                         v.<span class="formula-domain-variable"></span> = x</b>, <span class="formula-orderBy"></span>
                 </var>
            </div>
            <div id="chart-wrapper-1" class="shadow">
                <figure>
                    <canvas id="chart-1" class="w-100 p-3 bg-dark"></canvas>
                    <figcaption class="chart-caption text-secondary"></figcaption>
                </figure>
            </div>
        </div>
    </section>
</article>
