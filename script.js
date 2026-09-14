/* =========================================================
   SAHANYA STORE - MAIN SCRIPT
========================================================= */


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL = "https://sahanya-store.onrender.com/api";


/* =========================================================
   LOADING SCREEN
========================================================= */

let progress = 0;

const loader = document.getElementById("loader");
const loaderLine = document.querySelector(".loader-line span");
const loaderPercent = document.getElementById("loaderPercent");

const loadingInterval = setInterval(() => {

    progress += Math.floor(Math.random() * 7) + 1;

    if (progress >= 100) {

        progress = 100;

        clearInterval(loadingInterval);

        setTimeout(() => {

            loader?.classList.add("hide");

        }, 500);
    }

    if (loaderLine) {
        loaderLine.style.width = progress + "%";
    }

    if (loaderPercent) {
        loaderPercent.textContent = progress + "%";
    }

}, 70);


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMenu() {

    const nav = document.getElementById("navMenu");

    if (!nav) return;

    nav.classList.toggle("open");

}


/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

function closeMenu() {

    const nav = document.getElementById("navMenu");

    if (!nav) return;

    nav.classList.remove("open");

}


/* =========================================================
   CLOSE MENU AFTER NAVIGATION
========================================================= */

document.querySelectorAll("#navMenu a").forEach(link => {

    link.addEventListener("click", () => {

        closeMenu();

    });

});


/* =========================================================
   ADMIN MODAL
========================================================= */

function openAdmin() {

    const modal =
        document.getElementById("adminModal");

    if (!modal) return;

    modal.classList.add("show");

    document.body.classList.add("modal-open");

    setTimeout(() => {

        document
            .getElementById("adminUsername")
            ?.focus();

    }, 200);

}


/* =========================================================
   CLOSE ADMIN MODAL
========================================================= */

function closeAdmin() {

    const modal =
        document.getElementById("adminModal");

    if (!modal) return;

    modal.classList.remove("show");

    document.body.classList.remove("modal-open");

}


/* =========================================================
   CLOSE MODAL OUTSIDE
========================================================= */

window.addEventListener("click", function(event) {

    const modal =
        document.getElementById("adminModal");

    if (
        modal &&
        event.target === modal
    ) {

        closeAdmin();

    }

});


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeAdmin();

    }

});


/* =========================================================
   LOGIN SUCCESS
========================================================= */

function showLoginSuccess() {

    const notification =
        document.getElementById(
            "successNotification"
        );

    if (!notification) return;

    notification.classList.remove("show");

    void notification.offsetWidth;

    notification.classList.add("show");

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function adminLogin() {

    const usernameInput =
        document.getElementById(
            "adminUsername"
        );

    const passwordInput =
        document.getElementById(
            "adminPassword"
        );

    if (!usernameInput || !passwordInput) {

        return;

    }


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    if (!username || !password) {

        showLoginError(
            "Please enter username and password."
        );

        return;

    }


    if (
        username === "Sahanya" &&
        password === "2007"
    ) {

        localStorage.setItem(
            "sahanyaAdmin",
            "true"
        );


        closeAdmin();


        showLoginSuccess();


        setTimeout(() => {

            window.location.href =
                "admin.html";

        }, 1600);


    } else {

        showLoginError(
            "Invalid username or password."
        );

    }

}


/* =========================================================
   LOGIN ERROR
========================================================= */

function showLoginError(message) {

    const usernameInput =
        document.getElementById(
            "adminUsername"
        );

    const passwordInput =
        document.getElementById(
            "adminPassword"
        );


    if (usernameInput) {

        usernameInput.style.borderColor =
            "#ff3b3b";

    }


    if (passwordInput) {

        passwordInput.style.borderColor =
            "#ff3b3b";

    }


    const oldError =
        document.getElementById(
            "loginError"
        );

    oldError?.remove();


    const modalBox =
        document.querySelector(
            "#adminModal .modal-box"
        );

    if (!modalBox) {

        alert(message);

        return;

    }


    const error =
        document.createElement("div");

    error.id = "loginError";

    error.textContent = message;

    error.style.cssText = `
        margin-top: 12px;
        padding: 10px 14px;
        border-radius: 10px;
        background: rgba(255, 50, 50, 0.08);
        border: 1px solid rgba(255, 50, 50, 0.25);
        color: #ff5555;
        font-size: 12px;
        text-align: center;
    `;

    modalBox.appendChild(error);


    setTimeout(() => {

        error.remove();

        if (usernameInput) {
            usernameInput.style.borderColor = "";
        }

        if (passwordInput) {
            passwordInput.style.borderColor = "";
        }

    }, 3000);

}


/* =========================================================
   ENTER TO LOGIN
========================================================= */

document.addEventListener("keydown", function(event) {

    if (
        event.key === "Enter" &&
        document
            .getElementById("adminModal")
            ?.classList.contains("show")
    ) {

        adminLogin();

    }

});


/* =========================================================
   BUY ACCOUNT
========================================================= */

function buyAccount(accountName) {

    const phoneNumber = "94713200202";

    const message =
        "Hello Sahanya Store 👋\n\n" +
        "I want to buy this Free Fire account.\n\n" +
        "Account: " + accountName + "\n\n" +
        "Please send me the account details.";

    const whatsappURL =
        "https://wa.me/" +
        phoneNumber +
        "?text=" +
        encodeURIComponent(message);

    window.open(
        whatsappURL,
        "_blank"
    );

}


/* =========================================================
   CONTACT
========================================================= */

function contactUs() {

    alert(
        "Contact Sahanya Store\n\n" +
        "WhatsApp / Telegram / Facebook support."
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   STORE ACCOUNTS
========================================================= */

let storeAccounts = [];


/* =========================================================
   LOAD ACCOUNTS FROM POSTGRESQL
========================================================= */

async function loadStoreAccounts() {

    const grid =
        document.getElementById(
            "accountGrid"
        );

    try {

        console.log(
            "Loading accounts from PostgreSQL..."
        );


        const response =
            await fetch(
                `${API_URL}/accounts`
            );


        if (!response.ok) {

            throw new Error(
                `API Error: ${response.status}`
            );

        }


        const accounts =
            await response.json();


        console.log(
            "Accounts received:",
            accounts
        );


        storeAccounts =
            Array.isArray(accounts)
                ? accounts
                : [];


        /* =====================================================
           UPDATE FEATURED SECTION
        ===================================================== */

        renderFeaturedAccount(
            storeAccounts
        );


        /* =====================================================
           ACCOUNT GRID
        ===================================================== */

        if (!grid) return;


        /*
            If database has no accounts,
            keep original HTML cards.
        */

        if (storeAccounts.length === 0) {

            console.log(
                "No database accounts found. Keeping default HTML cards."
            );

            return;

        }


        /*
            Database has accounts,
            therefore remove default HTML cards.
        */

        grid.innerHTML = "";


        storeAccounts.forEach(
            account => {

                renderStoreAccount(
                    account,
                    grid
                );

            }
        );


        /*
            Re-apply search after rendering.
        */

        applySearch();


    } catch (error) {

        console.error(
            "Failed to load accounts:",
            error
        );


        /*
            If API is offline,
            keep existing HTML cards.
        */

        console.warn(
            "PostgreSQL API unavailable. Keeping default HTML accounts."
        );

    }

}


/* =========================================================
   FEATURED ACCOUNT
========================================================= */

function renderFeaturedAccount(accounts) {

    const featuredBox =
        document.querySelector(
            ".featured-box"
        );


    if (!featuredBox) {

        console.warn(
            "Featured box not found."
        );

        return;

    }


    /*
        Find accounts where featured = true.
    */

    const featuredAccounts =
        accounts.filter(
            account =>
                account.featured === true ||
                account.featured === "true"
        );


    /*
        If there is no featured account,
        keep the original HTML design.
    */

    if (featuredAccounts.length === 0) {

        console.log(
            "No featured account found."
        );

        return;

    }


    /*
        Use the first featured account.
    */

    const account =
        featuredAccounts[0];


    const accountName =
        account.name ||
        `Account #${account.id}`;


    const game =
        account.game ||
        "FREE FIRE";


    const server =
        account.server ||
        "-";


    const level =
        account.level ??
        "-";


    const evo =
        account.evo ??
        "-";


    const emotes =
        account.emotes ??
        "-";


    const bundles =
        account.bundles ||
        "-";


    const description =
        account.description ||
        "Premium featured gaming account.";


    const price =
        Number(account.price || 0);


    const image =
        account.image ||
        "";


    const isSold =
        String(account.status)
            .toLowerCase() === "sold";


    /*
        Create featured account content
        without changing the existing
        .featured-box container.
    */

    featuredBox.innerHTML = `

        <div class="featured-content">

            <span class="section-label">
                FEATURED ACCOUNT
            </span>


            <h2>
                ${escapeHTML(accountName)}
            </h2>


            <p>
                ${escapeHTML(description)}
            </p>


            <div class="featured-account-info">

                <span>
                    ${escapeHTML(game)}
                </span>

                <span>
                    Server ${escapeHTML(server)}
                </span>

                <span>
                    Level ${escapeHTML(level)}
                </span>

                <span>
                    Evo ${escapeHTML(evo)}
                </span>

                <span>
                    Emotes ${escapeHTML(emotes)}
                </span>

                <span>
                    Bundles ${escapeHTML(bundles)}
                </span>

            </div>


            <div class="featured-account-price">

                Rs.
                ${price.toLocaleString()}

            </div>


            <button
                type="button"
                class="primary-btn featured-buy-btn"
                ${isSold ? "disabled" : ""}
            >

                ${
                    isSold
                        ? "SOLD OUT"
                        : "BUY FEATURED ACCOUNT →"
                }

            </button>

        </div>


        ${
            image
                ? `
                    <div class="featured-account-image">

                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(accountName)}"
                            loading="lazy"
                        >

                    </div>
                `
                : ""
        }


        <div class="featured-glow"></div>

    `;


    /*
        Buy button
    */

    const buyButton =
        featuredBox.querySelector(
            ".featured-buy-btn"
        );


    if (
        buyButton &&
        !isSold
    ) {

        buyButton.addEventListener(
            "click",
            () => {

                buyAccount(
                    accountName
                );

            }
        );

    }

}


/* =========================================================
   RENDER SINGLE ACCOUNT
========================================================= */

function renderStoreAccount(
    account,
    grid
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "account-card glass";


    const isSold =
        String(account.status)
            .toLowerCase() === "sold";


    const image =
        account.image ||
        "images/account1.jpg";


    const accountName =
        account.name ||
        `Account #${account.id}`;


    const game =
        account.game ||
        "FREE FIRE";


    const server =
        account.server ||
        "-";


    const level =
        account.level ??
        "-";


    const evo =
        account.evo ??
        "-";


    const emotes =
        account.emotes ??
        "-";


    const bundles =
        account.bundles ||
        "-";


    const description =
        account.description ||
        "Premium gaming account.";


    const price =
        Number(account.price || 0);


    card.innerHTML = `

        <div class="account-image">

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(accountName)}"
                loading="lazy"
            >


            <div class="status ${
                isSold
                    ? "sold"
                    : "available"
            }">

                ${
                    isSold
                        ? "SOLD"
                        : "AVAILABLE"
                }

            </div>


            <div class="account-id">

                #${escapeHTML(account.id)}

            </div>

        </div>


        <div class="account-content">


            <div class="account-top">

                <h3>
                    ${escapeHTML(accountName)}
                </h3>

                <span class="game">
                    ${escapeHTML(game)}
                </span>

            </div>


            <p class="account-description">

                ${escapeHTML(description)}

            </p>


            <div class="account-info">


                <div>

                    <span>
                        SERVER
                    </span>

                    <strong>
                        ${escapeHTML(server)}
                    </strong>

                </div>


                <div>

                    <span>
                        LEVEL
                    </span>

                    <strong>
                        ${escapeHTML(level)}
                    </strong>

                </div>


                <div>

                    <span>
                        EVO GUNS
                    </span>

                    <strong>
                        ${escapeHTML(evo)}
                    </strong>

                </div>


                <div>

                    <span>
                        EMOTES
                    </span>

                    <strong>
                        ${escapeHTML(emotes)}
                    </strong>

                </div>


                <div>

                    <span>
                        BUNDLES
                    </span>

                    <strong>
                        ${escapeHTML(bundles)}
                    </strong>

                </div>


            </div>


            <div class="account-bottom">


                <div class="price">

                    <small>
                        PRICE
                    </small>

                    <strong>

                        Rs.
                        ${price.toLocaleString()}

                    </strong>

                </div>


                <button
                    class="buy-btn ${
                        isSold
                            ? "disabled"
                            : ""
                    }"
                    ${
                        isSold
                            ? "disabled"
                            : ""
                    }
                    type="button"
                >

                    ${
                        isSold
                            ? "Sold Out"
                            : "Buy Now →"
                    }

                </button>


            </div>


        </div>

    `;


    /*
        Add Buy button event safely.
    */

    const buyButton =
        card.querySelector(
            ".buy-btn"
        );


    if (
        buyButton &&
        !isSold
    ) {

        buyButton.addEventListener(
            "click",
            () => {

                buyAccount(
                    accountName
                );

            }
        );

    }


    grid.appendChild(card);

}


/* =========================================================
   SEARCH
========================================================= */

const searchInput =
    document.getElementById(
        "searchInput"
    );


const accountGrid =
    document.getElementById(
        "accountGrid"
    );


function applySearch() {

    if (
        !searchInput ||
        !accountGrid
    ) {

        return;

    }


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const cards =
        accountGrid.querySelectorAll(
            ".account-card"
        );


    cards.forEach(card => {

        const text =
            card.textContent
                .toLowerCase();


        if (
            text.includes(search)
        ) {

            card.style.display = "";

        } else {

            card.style.display =
                "none";

        }

    });

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        applySearch
    );

}


/* =========================================================
   ACTIVE NAV
========================================================= */

const sections =
    document.querySelectorAll(
        "main section"
    );


const navLinks =
    document.querySelectorAll(
        "#navMenu a"
    );


window.addEventListener(
    "scroll",
    () => {

        let current = "";


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 180;


            if (
                window.scrollY >=
                sectionTop
            ) {

                current =
                    section.getAttribute(
                        "id"
                    );

            }

        });


        navLinks.forEach(link => {

            link.classList.remove(
                "active"
            );


            if (
                link.getAttribute(
                    "href"
                ) === "#" + current
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

    }
);


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            function(event) {

                const targetId =
                    this.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });


                closeMenu();

            }
        );

    });


/* =========================================================
   INITIALIZE STORE
========================================================= */

loadStoreAccounts();


/* =========================================================
   3D HERO CHARACTER
========================================================= */

function initHero3D() {

    const container =
        document.getElementById(
            "character3D"
        );


    if (!container) {

        console.error(
            "3D container not found."
        );

        return;

    }


    if (typeof THREE === "undefined") {

        console.error(
            "Three.js not loaded."
        );

        return;

    }


    if (
        typeof THREE.GLTFLoader ===
        "undefined"
    ) {

        console.error(
            "GLTFLoader not loaded."
        );

        return;

    }


    /* =====================================================
       SCENE
    ===================================================== */

    const scene =
        new THREE.Scene();


    /* =====================================================
       CAMERA
    ===================================================== */

    const camera =
        new THREE.PerspectiveCamera(

            35,

            container.clientWidth /
            container.clientHeight,

            0.1,

            100

        );


    camera.position.set(
        0,
        1.2,
        6.2
    );


    /* =====================================================
       RENDERER
    ===================================================== */

    const renderer =
        new THREE.WebGLRenderer({

            antialias: true,

            alpha: true

        });


    renderer.setPixelRatio(

        Math.min(
            window.devicePixelRatio,
            2
        )

    );


    renderer.setSize(

        container.clientWidth,

        container.clientHeight

    );


    renderer.outputEncoding =
        THREE.sRGBEncoding;


    renderer.shadowMap.enabled =
        true;


    container.appendChild(
        renderer.domElement
    );


    /* =====================================================
       LIGHTING
    ===================================================== */

    const ambientLight =
        new THREE.HemisphereLight(

            0xeeeeee,

            0x080808,

            1.4

        );


    scene.add(
        ambientLight
    );


    /* ================= KEY LIGHT ================= */

    const keyLight =
        new THREE.DirectionalLight(

            0xfff2d0,

            2.0

        );


    keyLight.position.set(

        3,
        5,
        5

    );


    keyLight.castShadow =
        true;


    scene.add(
        keyLight
    );


    /* ================= YELLOW LIGHT ================= */

    const yellowLight =
        new THREE.PointLight(

            0xffb300,

            2.5,

            12

        );


    yellowLight.position.set(

        -2,
        2,
        3

    );


    scene.add(
        yellowLight
    );


    /* ================= RIM LIGHT ================= */

    const rimLight =
        new THREE.PointLight(

            0xffd500,

            3,

            12

        );


    rimLight.position.set(

        2,
        2,
        -3

    );


    scene.add(
        rimLight
    );


    /* =====================================================
       LOAD GLB
    ===================================================== */

    const loader =
        new THREE.GLTFLoader();


    let model = null;


    loader.load(

        "models/character.glb",


        function(gltf) {

            console.log(
                "3D character loaded successfully."
            );


            model =
                gltf.scene;


            const box =
                new THREE.Box3().setFromObject(
                    model
                );


            const size =
                box.getSize(
                    new THREE.Vector3()
                );


            const center =
                box.getCenter(
                    new THREE.Vector3()
                );


            model.position.set(

                -center.x,

                -center.y,

                -center.z

            );


            const maxSize =
                Math.max(

                    size.x,

                    size.y,

                    size.z

                );


            const targetSize = 2.5;


            const scale =
                targetSize /
                maxSize;


            model.scale.setScalar(
                scale
            );


            model.position.x = 0;


            model.position.y =
                -0.15;


            model.position.z =
                0;


            model.traverse(
                function(object) {

                    if (object.isMesh) {

                        object.castShadow =
                            true;

                        object.receiveShadow =
                            true;

                    }

                }
            );


            scene.add(
                model
            );


            console.log(
                "Character centered successfully."
            );

        },


        function(xhr) {

            if (xhr.total) {

                const percent =
                    (xhr.loaded /
                    xhr.total) *
                    100;


                console.log(

                    "3D Model Loading:",

                    percent.toFixed(0) +
                    "%"

                );

            }

        },


        function(error) {

            console.error(

                "ERROR loading character.glb:",

                error

            );

        }

    );


    /* =====================================================
       MOUSE MOVEMENT
    ===================================================== */

    let mouseX = 0;

    let mouseY = 0;


    let targetMouseX = 0;

    let targetMouseY = 0;


    window.addEventListener(

        "mousemove",

        function(event) {

            targetMouseX =

                (
                    event.clientX /
                    window.innerWidth
                ) * 2 - 1;


            targetMouseY =

                (
                    event.clientY /
                    window.innerHeight
                ) * 2 - 1;

        }

    );


    /* =====================================================
       ANIMATION
    ===================================================== */

    function animate() {

        requestAnimationFrame(
            animate
        );


        const time =
            performance.now() *
            0.001;


        mouseX +=

            (
                targetMouseX -
                mouseX
            ) * 0.05;


        mouseY +=

            (
                targetMouseY -
                mouseY
            ) * 0.05;


        if (model) {

            model.rotation.y +=
                0.003;


            model.rotation.y +=
                mouseX * 0.001;


            model.rotation.x =
                mouseY * 0.04;


            model.position.y =

                -0.15 +

                Math.sin(
                    time * 1.3
                ) * 0.06;

        }


        renderer.render(
            scene,
            camera
        );

    }


    animate();


    /* =====================================================
       RESIZE
    ===================================================== */

    function resize3D() {

        const width =
            container.clientWidth;


        const height =
            container.clientHeight;


        if (
            !width ||
            !height
        ) {

            return;

        }


        camera.aspect =
            width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(

            width,

            height

        );

    }


    window.addEventListener(

        "resize",

        resize3D

    );


    resize3D();

}


/* =========================================================
   START 3D
========================================================= */

initHero3D();