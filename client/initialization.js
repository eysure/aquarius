import interact from "interactjs";

const fullscreenWrapper = () => {
    /**
     * Element.requestFullScreen() polyfill
     * @author Chris Ferdinandi
     * @license MIT
     */
    if (!Element.prototype.requestFullscreen) {
        Element.prototype.requestFullscreen =
            Element.prototype.mozRequestFullscreen || Element.prototype.webkitRequestFullscreen || Element.prototype.msRequestFullscreen;
    }

    /**
     * document.exitFullScreen() polyfill
     * @author Chris Ferdinandi
     * @license MIT
     */
    if (!document.exitFullscreen) {
        document.exitFullscreen = document.mozExitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    }

    /**
     * document.fullscreenElement polyfill
     * Adapted from https://shaka-player-demo.appspot.com/docs/api/lib_polyfill_fullscreen.js.html
     * @author Chris Ferdinandi
     * @license MIT
     */
    if (!document.fullscreenElement) {
        Object.defineProperty(document, "fullscreenElement", {
            get: function() {
                return document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement;
            }
        });

        Object.defineProperty(document, "fullscreenEnabled", {
            get: function() {
                return document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitFullscreenEnabled;
            }
        });
    }

    document.addEventListener(
        "click",
        function(event) {
            // Ignore clicks that weren't on the toggle button
            if (!event.target.hasAttribute("data-toggle-fullscreen")) return;

            // If there's an element in fullscreen, exit
            // Otherwise, enter it
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        },
        false
    );
};

const gridTarget = interact.createSnapGrid({
    x: 1,
    y: 1
});

interact(".draggable")
    .draggable({
        allowFrom: ".window-titlebar,.handle",
        ignoreFrom: ".unhandle",
        restrict: {
            restriction: "parent",
            elementRect: { top: 0, left: 1, bottom: 0, right: 0 }
        },
        snap: { targets: [gridTarget] }
    })
    .on("dragmove", function(event) {
        var target = event.target,
            x = (parseInt(target.getAttribute("data-x")) || 0) + event.dx,
            y = (parseInt(target.getAttribute("data-y")) || 0) + event.dy;

        target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)";

        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
    });

interact(".resizable")
    .resizable({
        edges: {
            top: ".interactive-uu",
            left: ".interactive-ll",
            bottom: ".interactive-dd",
            right: ".interactive-rr"
        },
        restrictEdges: {
            outer: "parent"
        },
        snap: { targets: [gridTarget] }
    })
    .on("resizemove", function(event) {
        var target = event.target,
            x = parseInt(target.getAttribute("data-x")) || 0,
            y = parseInt(target.getAttribute("data-y")) || 0;

        target.style.width = event.rect.width + "px";
        target.style.height = event.rect.height + "px";

        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform = "translate(" + x + "px," + y + "px)";

        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
    });

interact(".rnd")
    .draggable({
        allowFrom: ".handle",
        ignoreFrom: ".unhandle",
        restrict: {
            restriction: "parent",
            elementRect: { top: 0, left: 1, bottom: 0, right: 0 }
        },
        snap: { targets: [gridTarget] }
    })
    .resizable({
        edges: {
            top: ".interactive-uu",
            left: ".interactive-ll",
            bottom: ".interactive-dd",
            right: ".interactive-rr"
        },
        restrictEdges: {
            outer: "parent"
        },
        snap: { targets: [gridTarget] }
    })
    .on("dragmove", function(event) {
        var target = event.target,
            x = (parseInt(target.getAttribute("data-x")) || 0) + event.dx,
            y = (parseInt(target.getAttribute("data-y")) || 0) + event.dy;

        target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)";

        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
    })
    .on("resizemove", function(event) {
        var target = event.target,
            x = parseInt(target.getAttribute("data-x")) || 0,
            y = parseInt(target.getAttribute("data-y")) || 0;

        target.style.width = event.rect.width + "px";
        target.style.height = event.rect.height + "px";

        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform = "translate(" + x + "px," + y + "px)";

        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
    });

const closeConfirm = () => {
    window.onbeforeunload = function() {
        return "Are you really want to perform the action?";
    };
};

const initialization = () => {
    fullscreenWrapper();
    // closeConfirm();
};

export default initialization;
