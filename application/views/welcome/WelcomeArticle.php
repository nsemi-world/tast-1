<article id="home" class="container-fluid m-0 p-5 mx-auto">
    <h1 class="text-center text-dark">
        <b>How much do you know about the Trans-atlantic Slave Trade?</b>
    </h1>
    
    <section id="services" class="p-3">
        <?php $this->load->view('welcome/ExquizzMeCard'); ?>
        <?php $this->load->view('welcome/ParticipationCard'); ?>
        <?php $this->load->view('welcome/ItineraryCard'); ?>
        <?php $this->load->view('welcome/DatabaseCard'); ?>
        <?php $this->load->view('welcome/ChartsCard'); ?>
    </section>
    <?php $this->load->view('quizz/TopQuizz'); ?>
</article>
