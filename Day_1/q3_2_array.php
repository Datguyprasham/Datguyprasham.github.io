<?php

$a= array(array(6,3),array(5,4));
$b = array(array(3,2),array(5,5));
echo "Matrix Addition <br>";

for($i=0;$i<2;$i++){
    for($j=0;$j<2;$j++){
        echo $a[$i][$j] + $b[$i][$j]." ";
    }
    echo "<br>";
}

?>