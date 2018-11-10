<?php
ob_start("ob_gzhandler");

include 'php/utils.php';

$articleid = null;
$pdo = null;

if(!isset($_GET['articleid'])) {
    echo getMasterView();
}
else {
    $articleid = $_GET['articleid'];
    $pdo = getPDO();
    $article = getArticle($pdo, $articleid);
    echo getDetailsView($pdo, $article);
}

function getMasterView() {
    $template = file_get_contents('./templates/template.html');

    $head           = file_get_contents('./templates/head.html');
    $header         = file_get_contents('./templates/header.html');
    $content        = file_get_contents('./templates/articles.html');
    $footer         = file_get_contents('./templates/footer.html');

    $my_scripts = '
        <script src="js/articles.js"></script>
    ';

    $head = str_replace('###MY_SCRIPTS###', $my_scripts, $head);
    $head = str_replace('###MY_METAS###', '', $head);

    $template = str_replace('###HEAD###', $head, $template);
    $template = str_replace('###HEADER###', $header, $template);
    $template = str_replace('###CONTENT###', $content, $template);
    $template = str_replace('###FOOTER###', $footer, $template);

    return $template;
    
}

function getDetailsView($pdo, $article) {
    $template = file_get_contents('./templates/template.html');

    $head           = file_get_contents('./templates/head.html');
    $header         = file_get_contents('./templates/header.html');
    $content        = file_get_contents('./templates/article.html');
    $footer         = file_get_contents('./templates/footer.html');

    $my_metas = "
        <meta property=\"og:type\"        content=\"article\">
        <meta property=\"og:title\"       content=\"$article->title\">
        <meta property=\"og:description\" content='$article->description'>
        <meta property=\"og:image\"       content=\"$article->imageUrl\">
        <meta property=\"og:url\"         content=\"https://tast.ngutu.org/articles.php?articleid=$article->articleid\">
        <meta property=\"og:site_name\"   content=\"tastXplorer, The Trans-atlantic Slave Trade Explorer\">
        <meta property=\"fb:app_id\"      content=\"716533442049508\" />
    ";
    $head .= $my_metas;

    $my_scripts = '
        <script src="js/articles.js"></script>
    ';
    $head = str_replace('###MY_SCRIPTS###', $my_scripts, $head);
    
    $sameAuthor = getSameAuthorArticleListExcept($pdo, $article->author, $article->articleid);    
    $latest = getLatestArticlesExcept($pdo, $article->articleid);
    
    $content = str_replace('###ARTICLE_TITLE###',    $article->title,    $content);
    $content = str_replace('###ARTICLE_AUTHOR###',   $article->author,   $content);
    $content = str_replace('###ARTICLE_DATE###',     $article->date,     $content);
    $content = str_replace('###ARTICLE_LOCATION###', $article->location, $content);
    $content = str_replace('###ARTICLE_CONTENT###',  $article->content,  $content);
    $content = str_replace('tastXplorer', '<span class="logo"><span>tast</span><span class="loading">X</span><span>plorer</span></span>', $content);

    $template = str_replace('###HEAD###', $head, $template);
    $template = str_replace('###HEADER###', $header, $template);
    $template = str_replace('###CONTENT###', $content, $template);
    $template = str_replace('###FOOTER###', $footer, $template);

    return $template;
}

function getArticle($pdo, $articleid) {
    $sql = "SELECT * FROM article WHERE articleid=$articleid";
    $erg = $pdo->query($sql);
    $result = $erg->fetch(PDO::FETCH_OBJ);
    return $result;
}

function getSameAuthorArticleListExcept($pdo, $author, $articleid) {
    $sql = "SELECT * FROM article WHERE author='$author' AND articleid!=$articleid";
    //var_dump($sql);
    $erg = $pdo->query($sql);
    $result = $erg->fetchAll(PDO::FETCH_OBJ);
    return createArticleList($result);
}

function getLatestArticlesExcept($pdo, $articleid) {
    $sql = "SELECT * FROM article WHERE articleid!=$articleid";
    $erg = $pdo->query($sql);
    $result = $erg->fetchAll(PDO::FETCH_OBJ);
    return createArticleList($result);
}

function createArticleList($articles) {
    $result = '';    
    foreach($articles as $article) {
        $result .= createArticleCard($article);
    }
    return $result;
}

function createArticleCard($article) {
    $card = '<div>';
    $card .= '<p class="mt-0 mb-0">'.$article->title.' -- <i> by '. $article->author .'</i></p>';
    $card .= '</div>';
    return $card;
}

function createCurrentArticle($article) {
    
}















ob_end_flush();
?>