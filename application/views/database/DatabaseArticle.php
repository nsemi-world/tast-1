<article id="database" class="container-fluid text-justify">
    <section class="frontpage">
        <div class="title-wrapper">
            <h2 class="h2 title">Understanding the <i>Voyages Database</i></h2>
        </div>
    </section>
    <section id="introduction" class="container shadow my-5 p-5">
        <h3 class="h3 border-bottom">Introduction</h3>
        <div>
            <p>
                The Voyages Database is constituted by <span class="OBSERVATIONS"></span> observations of <span class="VARIABLES"></span> variables, a total of <span class="CELLS"></span> data cells.
            </p>
            <p>
                Our first step towards understanding the data is to know the variables meaning. It will then be clear that there are two type of varables: <i>regular</i> and <i>inputed</i>. As I understand it, inputed variables where infered from regular variables or other sources, by means of some statistical method. Regular variables, are those extracted directly from the sources. Finally we will assess how sparse the data is by calculating the coverage of the dataset and from individual variable and observations.
            </p>
        </div>
    </section>
    <section id="variables" class="container shadow my-5 p-5">
        <h3 class="h3 border-bottom">Variable Meaning and Coverage</h3>
        <div>
            <p>There are a total of <span class="VARIABLES"></span> distinct variables, some related with each other, others independent. They are summarized in Table 1.</p>
            <p>
                Table 1 give us in tabular form a relation of variable names, their meaning and coverage. Coverage of a variable is important when extracting information from the data. For instance, variables with greater coverage are good tools to make more informed analysis as they take more observations into account and will possibly be more accurate. You can use the search input box to filter the table when looking for a variable.
            </p>
            <p>It is unpracticable to show about 10 million data cells at once. To give you a confortable and flexible way to access the data in the database, you can specify which variables you want to observe. This way you can control the amount of data you are exposed and better focus your analysis. The workflow is:</p>
            <ul>
                <li>Select which variables you want to access, by clicking on their respective rows on Table 1. Clicks on selected rows will deselect them. <var>voyageid</var> is selected by default. The variables will be collected in a list.</li>
                <li>You can remove variables from the desired list also by dragging them off the list into the trash bin. This is particularly if you clicked variables from distinct pages.</li>
                <li>Choose if you want to see data from the original raw data or joined with related tables, by checking the checkbox on or off.</li>
                <li>Click <i>Observe</i> and see the results.</li>
            </ul>
            <div class="table-container mx-auto small p-3 m-5 shadow">
                <table id="variables-table" class="table small compact">
                    <caption>
                        Table 1: Name, meaning and coverage of variables from the <i>Voyages Database.</i>
                    </caption>
                    <thead>
                    <th>Name</th>
                    <th>Meaning</th>
                    <th>Observations</th>
                    <th>Coverage %</th>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>

            <div class="table-container mx-auto small m-5 shadow clearfix">
                <div class="p-1 shadow border-bottom border-warning bg-dark text-warning sticky-top">
                    <div class="row m-0 p-0">
                        <div id="droppable-trash" class="col-auto pt-2">
                            <span class="fas fa-trash text-danger"></span>
                        </div>
                        <div id="variables-checklist-badges" class="col my-auto">
                            <span class="badge badge-secondary my-auto">voyageid</span>
                        </div>
                        <div class="col-auto form-group my-auto">
                            <div id="vsubsets" class="dropdown d-inline mr-2">
                                <button type="button" class="dropdown-toggle dropdown-toggle-split btn btn-sm btn-outline-secondary" data-toggle="dropdown" aria-haspopup="true" id="vsubsets-dropdown-button">Pre-selected Varibales </button>
                                <div class="dropdown-menu dropdown-menu-right bg-dark" aria-labelledby="vsubsets-dropdown-button" role="menu">
                                    <a class="dropdown-item" href="#" title="voyageid, shipname, national, natinimp">
                                        Sovereignity
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, shipname, rig, tonnage, placcons, yrcons">
                                        Ship construction
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, shipname, placreg, regisreg, yrreg">
                                        Ship registration
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, shipname, ownera, ownerb, ownerc, ownerd, ownere, ownerf, ownerg, ownerh, owneri, ownerj, ownerk, ownerl, ownerm, ownern, ownero">
                                        Ship onwership 1 
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, shipname, captaina, captainb, captainc, crew, crew1, crewdied, ndesert, crew5">
                                        Crew 
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, datedepa, datedepb, datedepc, datedep">
                                        Departure dates
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, portdep, ptdepimp, deptregimp, deptregimp1">
                                        Departure places
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, portdep, portdepimp, datedep">
                                        Departure event: Event
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, majbuypt, mjbyptimp, majbyimp">
                                        Principal Purchasing Event
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, embport, plac1tra, datebuy">
                                        1st Purchasing Event
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, embport2, embreg2, plac2tra, regem2">
                                        2nd Purchasing Event
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, plac3tra, regem3, datarr39, datarr40, datarr41">
                                        3rd Purchasing Event
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, dlslatra, dlslatrb, dlslatrc, dateleftafr, tslavesd">
                                        Out of Africa
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, majselpt, mjslptimp, mjselimp, yearam">
                                        Principal Disembarkation Event
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, sla1port, regdis1, regarr, mjselimp1, ddepam, ddepamb, ddepamc, datarr32, datarr33, datarr34, yearam">
                                        1st Landing Event
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, regarr2, datarr36, datarr37, datarr38, dateland2">
                                        2nd Landing Event
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, adpsale2, regdis3, ddepam, ddepamb, ddepamc">
                                        3rd Landing Event
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, datedepam, retrnreg, retrnreg1">
                                        Return Event Return
                                    </a>
                                    <a class="dropdown-item" href="#" title="voyageid, portret, dateend">
                                        End
                                    </a>
                                </div>
                            </div>
                            <label for="rawdata" class="display-inline btn btn-sm btn-outline-secondary from-group my-1">
                                <input id="rawdata" type="checkbox" class=""/>
                                Raw Data
                            </label>
                            <button id="observe-button" class="btn btn-sm btn-success">Observe</button>
                        </div>
                    </div>
                </div>
                <div class="container p-3">
                    <table id="single-vo-table" class="table small compact">
                        <caption>
                            Table 2: Observations for custom variable subsets<span class="observing"></span>
                        </caption>
                        <thead>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <p>
                    We have pre-selected <span class="PREDEFINED-SUBSETS"></span> variables subsets for rapid data access. Remember that with <span class="VARIABLES"></span> variables we can produce 2<sup><span class="VARIABLES"></span></sup> = <span class="SUBSETS"></span>, that is, plenty room to  play.
                </p>


            </div>
        </div>
    </section>
</article>
