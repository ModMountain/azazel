// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually summon from.
process.chdir(__dirname);

(function() {
    var Azazel;
    try {
        Azazel = require("Azazel");
    } catch (e) {
        console.error(e);
        console.error("It looks like you haven't installed any dependencies");
        console.error("Please run 'npm install' from a terminal, then try again.");
        return;
    }

    Azazel.summon();
})();
