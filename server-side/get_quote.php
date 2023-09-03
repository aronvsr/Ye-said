<?php
// Set the content type and character encoding.
header('Content-Type: text/plain; charset=utf-8');

// Define the path to the quotes.txt file in the same directory.
$filename = 'quotes.txt';

// Read the lines from the file into an array.
$lines = file($filename);

// Check if the file was successfully read.
if ($lines === false) {
    die("Unable to read file: $filename");
}

// Get a random line from the array.
$randomLine = $lines[array_rand($lines)];

// Check if the random line is empty.
if (empty($randomLine)) {
    // If it's empty, set it to the specified string.
    $randomLine = "I'm nice at ping pong";
}

// Replace '\n' with actual newlines for React Native display.
$randomLine = str_replace('\n', "\n", $randomLine);

// Trim one newline character from the end of the random line.
$randomLine = rtrim($randomLine, "\n");

// Output the random line.
echo $randomLine;
?>
