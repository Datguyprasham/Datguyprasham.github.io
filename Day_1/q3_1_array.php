<?php
    $days = array();
    for ($i = 0; $i < 7; $i++) {
        $days[$i] = jddayofweek($i,1);
        echo $days[$i];
        echo "<br>";
    }
?>
