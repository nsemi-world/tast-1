<header class="shadow d-flex flex-column justify-content-center">
    <nav class="container-fluid d-flex justify-content-around m-0 p-0">
        <a class="navbar-brand logo" href="<?=base_url();?>">
            <span>tast</span>
            <span class="loading">X</span>
            <span>plorer</span>
        </a>
        <div id="menu" class="d-flex">
                <a id="toggle_home" href="<?=base_url();?>welcome" class="btn bg-transparent active" title="Home"><i class="fas fa-home"></i></a>

                <div class="dropdown">
                    <button id="explore-dropdown-button" 
                            class="dropdown-toggle btn btn-transparent" 
                            type="button" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false">Explore</button>

                    <div class="dropdown-menu bg-dark" aria-labelledby="explore-dropdown-button">
                        <a class="dropdown-item" id="toggle_participation" href="<?=base_url();?>explorer/participation" title="Participation">
                            <i class="fas fa-crown"></i>
                            World Participation
                        </a>
                        <a class="dropdown-item" id="toggle_voyages" href="<?=base_url();?>explorer/voyages">
                            <i class="fas fa-atlas" title="Voyages"></i>
                            Voyage Itineraries
                        </a>
                        <a  class="dropdown-item" id="toggle_database" href="<?=base_url();?>explorer/database"title="Database">
                            <i class="fas fa-database"></i>
                            Database
                        </a>
                        <a class="dropdown-item" id="toggle_charts" href="<?=base_url();?>explorer/charts" title="Charts">
                            <i class="fas fa-chart-pie"></i>
                            Charts
                        </a>
                        <a class="dropdown-item" id="toggle_quizz" href="<?=base_url();?>welcome#explore">
                            <i class="fas fa-brain" title="Voyages"></i>
                            exQUIZZme!
                        </a>
                    </div>
                </div>
                <div class="dropdown">
                    <button id="resources-dropdown-button" 
                            class="dropdown-toggle btn btn-transparent" 
                            type="button" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false">Resources</button>

                    <div class="dropdown-menu bg-dark" aria-labelledby="resources-dropdown-button">
                        <a class="dropdown-item" id="toggle_articles" href="<?=base_url();?>resources/articles" title="Articles">
                            <i class="fas fa-book-open"></i>
                            Articles
                        </a>
                        <a class="dropdown-item" id="toggle_resources" href="<?=base_url();?>resources" title="Resources">
                            <i class="fab fa-amazon"></i>
                            Books on Slavery
                        </a>
                        <a class="dropdown-item d-none" id="toggle_external" href="<?=base_url();?>resources/videos" title="Videos">
                            <i class="fas fa-globe"></i>
                            Videos
                        </a>
                        <a class="dropdown-item d-none" id="toggle_external" href="<?=base_url();?>resources/external-links" title="External links">
                            <i class="fas fa-globe"></i>
                            External Links
                        </a>
                    </div>
                </div>

                <div class="dropdown">
                    <button class="dropdown-toggle btn btn-transparent" type="button" id="about-us-dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">About Us</button>
                    <div class="dropdown-menu bg-dark" aria-labelledby="about-us-dropdown-button">
                        <a class="dropdown-item" id="toggle_about_us" href="about-us.php" title="About Us">
                            <span style="font-family: var(--link-font);">X </span> 
                            About Us
                        </a>
                        <a class="dropdown-item" id="toggle_impressum" href="impressum-and-privacy.php" title="Impressum">
                            <i class="fas fa-certificate"></i>
                            Impressum and Privacy
                        </a>
                    </div>
                </div>
                <div class="dropdown">
                    <a id="toggle_login" href="#" class="btn bg-transparent dropdown-toggle" title="Login with Facebook" data-toggle="dropdown" aria-haspopup="true" aria-expanded=false>
                        <i id="user-photo" class="fas fa-user-circle"></i>
                        <img src="#" class=""/>
                    </a>
                    <div id="guest-login" class="dropdown-menu bg-dark">
                        <a class="dropdown-item" id="login" href="#" title="login">Login with Facebook</a>
                    </div>
                    <div id="user-login" class="dropdown-menu bg-dark" style="display: none;">
                        <a class="dropdown-item" id="profile" href="#" title="profile">Profile</a>
                        <a class="dropdown-item" id="logout" href="#" title="logout">Logout</a>
                    </div>
                </div>
            </div>
    </nav>    
</header>
