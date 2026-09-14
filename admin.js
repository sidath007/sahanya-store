/* =========================================================
   SAHANYA STORE - ADMIN CONTROL CENTER
   PostgreSQL API Version
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const API_URL =
    "http://localhost:5000/api";


/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

if (
    localStorage.getItem("sahanyaAdmin") !== "true"
) {

    window.location.href =
        "index.html";

}


/* =========================================================
   ACCOUNT STORAGE
========================================================= */

let accounts = [];


/* =========================================================
   CURRENT IMAGE
========================================================= */

let currentImage = "";


/* =========================================================
   TOAST TIMER
========================================================= */

let adminToastTimer = null;


/* =========================================================
   TOAST
========================================================= */

function showAdminToast(
    title,
    message,
    icon = "✓",
    type = "success"
) {

    const toast =
        document.getElementById(
            "adminToast"
        );

    const toastIcon =
        document.getElementById(
            "toastIcon"
        );

    const toastTitle =
        document.getElementById(
            "toastTitle"
        );

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (
        !toast ||
        !toastIcon ||
        !toastTitle ||
        !toastMessage
    ) {

        console.warn(
            `${title}: ${message}`
        );

        return;

    }


    clearTimeout(
        adminToastTimer
    );


    toast.classList.remove(
        "show",
        "error",
        "warning"
    );


    toastIcon.textContent =
        icon;

    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;


    if (type === "error") {

        toast.classList.add(
            "error"
        );

    }

    else if (type === "warning") {

        toast.classList.add(
            "warning"
        );

    }


    void toast.offsetWidth;


    toast.classList.add(
        "show"
    );


    adminToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   LOAD ACCOUNTS FROM POSTGRESQL
========================================================= */

async function loadAccounts() {

    try {

        const response =
            await fetch(
                `${API_URL}/accounts`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid accounts response"
            );

        }


        accounts =
            data;


        updateStats();

        renderAccounts();

        renderFeaturedAccounts();


    } catch (error) {

        console.error(
            "LOAD ACCOUNTS ERROR:",
            error
        );


        accounts = [];


        updateStats();

        renderAccounts();

        renderFeaturedAccounts();


        showAdminToast(
            "DATABASE ERROR",
            "Could not load accounts from PostgreSQL.",
            "!",
            "error"
        );

    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(
    sectionId,
    button = null
) {

    const sections =
        document.querySelectorAll(
            ".admin-section"
        );


    sections.forEach(
        section => {

            section.classList.remove(
                "active-section"
            );

        }
    );


    const target =
        document.getElementById(
            sectionId
        );


    if (target) {

        target.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(
            ".side-link"
        )
        .forEach(
            link => {

                link.classList.remove(
                    "active"
                );

            }
        );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    if (
        sectionId ===
        "dashboard"
    ) {

        updateStats();

    }


    if (
        sectionId ===
        "accounts"
    ) {

        renderAccounts();

    }


    if (
        sectionId ===
        "featured"
    ) {

        renderFeaturedAccounts();

    }


    document
        .getElementById(
            "sidebar"
        )
        ?.classList.remove(
            "open"
        );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (sidebar) {

        sidebar.classList.toggle(
            "open"
        );

    }

}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateStats() {

    const total =
        accounts.length;


    const available =
        accounts.filter(
            account =>
                account.status !==
                "sold"
        ).length;


    const sold =
        accounts.filter(
            account =>
                account.status ===
                "sold"
        ).length;


    const featured =
        accounts.filter(
            account =>
                account.featured ===
                true
        ).length;


    const totalElement =
        document.getElementById(
            "totalAccounts"
        );


    const availableElement =
        document.getElementById(
            "availableAccounts"
        );


    const soldElement =
        document.getElementById(
            "soldAccounts"
        );


    const featuredElement =
        document.getElementById(
            "featuredAccounts"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (availableElement) {

        availableElement.textContent =
            available;

    }


    if (soldElement) {

        soldElement.textContent =
            sold;

    }


    if (featuredElement) {

        featuredElement.textContent =
            featured;

    }

}


/* =========================================================
   RENDER ACCOUNTS
========================================================= */

function renderAccounts(
    searchTerm = ""
) {

    const container =
        document.getElementById(
            "adminAccounts"
        );


    if (!container) return;


    const search =
        String(
            searchTerm
        )
            .toLowerCase()
            .trim();


    const filtered =
        accounts.filter(
            account => {

                const text = `
                    ${account.name || ""}
                    ${account.game || ""}
                    ${account.server || ""}
                    ${account.level || ""}
                    ${account.evo || ""}
                    ${account.emotes || ""}
                    ${account.bundles || ""}
                    ${account.description || ""}
                `.toLowerCase();


                return text.includes(
                    search
                );

            }
        );


    container.innerHTML =
        "";


    if (
        filtered.length ===
        0
    ) {

        container.innerHTML = `

            <div style="
                padding:40px;
                text-align:center;
                color:rgba(255,255,255,.4);
                width:100%;
            ">

                ${
                    accounts.length === 0
                        ? "No accounts yet. Add your first account."
                        : "No accounts found."
                }

            </div>

        `;

        return;

    }


    filtered.forEach(
        account => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-account";


            const isSold =
                account.status ===
                "sold";


            const image =
                account.image ||
                "";


            div.innerHTML = `

                <div class="admin-account-image">

                    ${
                        image
                            ? `
                                <img
                                    src="${escapeHTML(image)}"
                                    alt="${escapeHTML(account.name)}"
                                >
                            `
                            : `
                                <div class="no-image">
                                    NO IMAGE
                                </div>
                            `
                    }

                </div>


                <div class="admin-account-info">

                    <h3>
                        ${escapeHTML(
                            account.name
                        )}
                    </h3>


                    <p>

                        ${escapeHTML(
                            account.game ||
                            "FREE FIRE"
                        )}

                        •

                        ${escapeHTML(
                            account.server ||
                            "SG"
                        )}

                        • Level

                        ${escapeHTML(
                            account.level ||
                            "N/A"
                        )}

                    </p>


                    <div class="admin-details">

                        <span>
                            Evo Guns:
                            <b>
                                ${escapeHTML(
                                    account.evo ||
                                    "0"
                                )}
                            </b>
                        </span>


                        <span>
                            Emotes:
                            <b>
                                ${escapeHTML(
                                    account.emotes ||
                                    "0"
                                )}
                            </b>
                        </span>


                        <span>
                            Bundles:
                            <b>
                                ${escapeHTML(
                                    account.bundles ||
                                    "0"
                                )}
                            </b>
                        </span>

                    </div>


                    <div class="admin-status ${
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


                    <div class="price">

                        Rs.
                        ${Number(
                            account.price || 0
                        ).toLocaleString()}

                    </div>

                </div>


                <div class="account-actions">

                    <button
                        class="edit"
                        onclick="editAccount('${escapeHTML(account.id)}')"
                    >
                        Edit
                    </button>


                    <button
                        onclick="toggleStatus('${escapeHTML(account.id)}')"
                    >

                        ${
                            isSold
                                ? "Mark Available"
                                : "Mark Sold"
                        }

                    </button>


                    <button
                        onclick="toggleFeatured('${escapeHTML(account.id)}')"
                    >

                        ${
                            account.featured
                                ? "Remove Featured"
                                : "Featured"
                        }

                    </button>


                    <button
                        class="delete"
                        onclick="deleteAccount('${escapeHTML(account.id)}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            container.appendChild(
                div
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

const adminSearch =
    document.getElementById(
        "adminSearch"
    );


if (adminSearch) {

    adminSearch.addEventListener(
        "input",
        function () {

            renderAccounts(
                this.value
            );

        }
    );

}


/* =========================================================
   ACCOUNT FORM
========================================================= */

function openAccountForm(
    account = null
) {

    const formSection =
        document.getElementById(
            "accountForm"
        );


    const formTitle =
        document.getElementById(
            "formTitle"
        );


    const editId =
        document.getElementById(
            "editId"
        );


    const form =
        document.getElementById(
            "accountFormElement"
        );


    if (
        !formSection ||
        !form
    ) {

        console.error(
            "Account form not found."
        );

        return;

    }


    if (account) {

        if (formTitle) {

            formTitle.textContent =
                "Edit Account";

        }


        if (editId) {

            editId.value =
                account.id || "";

        }


        document.getElementById(
            "accountName"
        ).value =
            account.name || "";


        document.getElementById(
            "accountGame"
        ).value =
            account.game ||
            "FREE FIRE";


        document.getElementById(
            "accountServer"
        ).value =
            account.server || "";


        document.getElementById(
            "accountLevel"
        ).value =
            account.level || "";


        document.getElementById(
            "accountEvo"
        ).value =
            account.evo || "";


        document.getElementById(
            "accountEmotes"
        ).value =
            account.emotes || "";


        document.getElementById(
            "accountBundles"
        ).value =
            account.bundles || "";


        document.getElementById(
            "accountPrice"
        ).value =
            account.price || "";


        document.getElementById(
            "accountDescription"
        ).value =
            account.description || "";


        document.getElementById(
            "accountFeatured"
        ).checked =
            Boolean(
                account.featured
            );


        document.getElementById(
            "accountStatus"
        ).value =
            account.status ||
            "available";


        currentImage =
            account.image || "";


        updateImagePreview();

    }

    else {

        if (formTitle) {

            formTitle.textContent =
                "Add New Account";

        }


        if (editId) {

            editId.value =
                "";

        }


        form.reset();


        document.getElementById(
            "accountGame"
        ).value =
            "FREE FIRE";


        document.getElementById(
            "accountStatus"
        ).value =
            "available";


        document.getElementById(
            "accountFeatured"
        ).checked =
            false;


        currentImage =
            "";


        updateImagePreview();

    }


    document
        .querySelectorAll(
            ".admin-section"
        )
        .forEach(
            section => {

                section.classList.remove(
                    "active-section"
                );

            }
        );


    formSection.classList.add(
        "active-section"
    );


    formSection.style.display =
        "block";


    document
        .getElementById(
            "sidebar"
        )
        ?.classList.remove(
            "open"
        );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   CLOSE FORM
========================================================= */

function closeAccountForm() {

    const form =
        document.getElementById(
            "accountFormElement"
        );


    if (form) {

        form.reset();

    }


    document.getElementById(
        "accountGame"
    ).value =
        "FREE FIRE";


    document.getElementById(
        "accountStatus"
    ).value =
        "available";


    currentImage =
        "";


    updateImagePreview();


    const formSection =
        document.getElementById(
            "accountForm"
        );


    if (formSection) {

        formSection.classList.remove(
            "active-section"
        );

        formSection.style.display =
            "none";

    }


    const dashboard =
        document.getElementById(
            "dashboard"
        );


    if (dashboard) {

        dashboard.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(
            ".side-link"
        )
        .forEach(
            link => {

                link.classList.remove(
                    "active"
                );

            }
        );


    const dashboardButton =
        document.querySelector(
            '.side-link[onclick*="dashboard"]'
        );


    if (dashboardButton) {

        dashboardButton.classList.add(
            "active"
        );

    }

}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

const accountImage =
    document.getElementById(
        "accountImage"
    );


if (accountImage) {

    accountImage.addEventListener(
        "change",
        function () {

            const file =
                this.files?.[0];


            if (!file) return;


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showAdminToast(
                    "INVALID IMAGE",
                    "Please select a valid image file.",
                    "!",
                    "error"
                );

                this.value =
                    "";

                return;

            }


            if (
                file.size >
                10 * 1024 * 1024
            ) {

                showAdminToast(
                    "IMAGE TOO LARGE",
                    "Please select an image under 10MB.",
                    "!",
                    "error"
                );

                this.value =
                    "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const image =
                        new Image();


                    image.onload =
                        function () {

                            compressImage(
                                image,
                                function (
                                    compressedImage
                                ) {

                                    if (
                                        !compressedImage
                                    ) {

                                        showAdminToast(
                                            "UPLOAD FAILED",
                                            "Could not process this image.",
                                            "!",
                                            "error"
                                        );

                                        return;

                                    }


                                    currentImage =
                                        compressedImage;


                                    updateImagePreview();


                                    showAdminToast(
                                        "IMAGE UPLOADED",
                                        "Account image uploaded successfully.",
                                        "↑"
                                    );

                                }
                            );

                        };


                    image.onerror =
                        function () {

                            showAdminToast(
                                "UPLOAD FAILED",
                                "Could not read this image.",
                                "!",
                                "error"
                            );

                            accountImage.value =
                                "";

                        };


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                function () {

                    showAdminToast(
                        "UPLOAD FAILED",
                        "Could not load this image.",
                        "!",
                        "error"
                    );

                    accountImage.value =
                        "";

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   IMAGE COMPRESSION
========================================================= */

function compressImage(
    image,
    callback
) {

    const canvas =
        document.createElement(
            "canvas"
        );


    const maxWidth =
        1000;


    const maxHeight =
        1000;


    let width =
        image.naturalWidth ||
        image.width;


    let height =
        image.naturalHeight ||
        image.height;


    if (
        width <= 0 ||
        height <= 0
    ) {

        callback("");

        return;

    }


    if (
        width >
        maxWidth
    ) {

        const ratio =
            maxWidth / width;

        width =
            Math.round(
                width * ratio
            );

        height =
            Math.round(
                height * ratio
            );

    }


    if (
        height >
        maxHeight
    ) {

        const ratio =
            maxHeight / height;

        width =
            Math.round(
                width * ratio
            );

        height =
            Math.round(
                height * ratio
            );

    }


    canvas.width =
        width;

    canvas.height =
        height;


    const ctx =
        canvas.getContext(
            "2d"
        );


    if (!ctx) {

        callback("");

        return;

    }


    ctx.drawImage(
        image,
        0,
        0,
        width,
        height
    );


    const compressedImage =
        canvas.toDataURL(
            "image/jpeg",
            0.82
        );


    callback(
        compressedImage
    );

}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

function updateImagePreview() {

    const preview =
        document.getElementById(
            "imagePreview"
        );


    if (!preview) return;


    if (currentImage) {

        preview.innerHTML = `

            <img
                src="${escapeHTML(currentImage)}"
                alt="Account Preview"
            >

            <div class="preview-overlay">
                IMAGE READY
            </div>

        `;

    }

    else {

        preview.innerHTML = `

            <div class="preview-empty">

                <span class="preview-icon">
                    🖼
                </span>

                <strong>
                    ACCOUNT IMAGE
                </strong>

                <small>
                    Upload account screenshot
                </small>

            </div>

        `;

    }

}


/* =========================================================
   REMOVE IMAGE
========================================================= */

function removeImage() {

    currentImage =
        "";


    const input =
        document.getElementById(
            "accountImage"
        );


    if (input) {

        input.value =
            "";

    }


    updateImagePreview();


    showAdminToast(
        "IMAGE REMOVED",
        "Account image has been removed.",
        "×"
    );

}


/* =========================================================
   SAVE ACCOUNT
========================================================= */

const accountFormElement =
    document.getElementById(
        "accountFormElement"
    );


if (accountFormElement) {

    accountFormElement.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const editId =
                document.getElementById(
                    "editId"
                )?.value.trim();


            const name =
                document.getElementById(
                    "accountName"
                )?.value.trim();


            const game =
                document.getElementById(
                    "accountGame"
                )?.value.trim();


            const server =
                document.getElementById(
                    "accountServer"
                )?.value.trim();


            const level =
                document.getElementById(
                    "accountLevel"
                )?.value.trim();


            const evo =
                document.getElementById(
                    "accountEvo"
                )?.value.trim();


            const emotes =
                document.getElementById(
                    "accountEmotes"
                )?.value.trim();


            const bundles =
                document.getElementById(
                    "accountBundles"
                )?.value.trim();


            const price =
                document.getElementById(
                    "accountPrice"
                )?.value.trim();


            const description =
                document.getElementById(
                    "accountDescription"
                )?.value.trim();


            const featured =
                document.getElementById(
                    "accountFeatured"
                )?.checked ||
                false;


            const status =
                document.getElementById(
                    "accountStatus"
                )?.value ||
                "available";


            if (!name) {

                showAdminToast(
                    "NAME REQUIRED",
                    "Please enter the account name.",
                    "!",
                    "error"
                );

                return;

            }


            if (!price) {

                showAdminToast(
                    "PRICE REQUIRED",
                    "Please enter the account price.",
                    "!",
                    "error"
                );

                return;

            }


            if (
                Number(price) < 0
            ) {

                showAdminToast(
                    "INVALID PRICE",
                    "Price cannot be negative.",
                    "!",
                    "error"
                );

                return;

            }


            const accountData = {

                name:
                    name,

                game:
                    game ||
                    "FREE FIRE",

                server:
                    server ||
                    "SG",

                level:
                    level ||
                    "",

                evo:
                    evo ||
                    "",

                emotes:
                    emotes ||
                    "",

                bundles:
                    bundles ||
                    "",

                price:
                    price,

                description:
                    description ||
                    "",

                featured:
                    featured,

                status:
                    status,

                image:
                    currentImage ||
                    ""

            };


            try {

                let response;


                /* ================= EDIT ================= */

                if (editId) {

                    response =
                        await fetch(
                            `${API_URL}/accounts/${editId}`,
                            {

                                method:
                                    "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        accountData
                                    )

                            }
                        );

                }


                /* ================= ADD ================= */

                else {

                    response =
                        await fetch(
                            `${API_URL}/accounts`,
                            {

                                method:
                                    "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        accountData
                                    )

                            }
                        );

                }


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Request failed"
                    );

                }


                if (editId) {

                    showAdminToast(
                        "ACCOUNT UPDATED",
                        "Account changes saved successfully.",
                        "✓"
                    );

                }

                else {

                    showAdminToast(
                        "ACCOUNT ADDED",
                        "New account added successfully.",
                        "✓"
                    );

                }


                await loadAccounts();


                closeAccountForm();


            } catch (error) {

                console.error(
                    "SAVE ACCOUNT ERROR:",
                    error
                );


                showAdminToast(
                    "SAVE FAILED",
                    error.message ||
                    "Could not save account.",
                    "!",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   EDIT ACCOUNT
========================================================= */

function editAccount(id) {

    const account =
        accounts.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!account) {

        showAdminToast(
            "ACCOUNT NOT FOUND",
            "The account could not be found.",
            "!",
            "error"
        );

        return;

    }


    openAccountForm(
        account
    );

}


/* =========================================================
   DELETE ACCOUNT
========================================================= */

async function deleteAccount(id) {

    const account =
        accounts.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!account) {

        showAdminToast(
            "ACCOUNT NOT FOUND",
            "The account could not be found.",
            "!",
            "error"
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete "${account.name}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/accounts/${id}`,
                {
                    method:
                        "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Delete failed"
            );

        }


        await loadAccounts();


        showAdminToast(
            "ACCOUNT DELETED",
            "Account removed successfully.",
            "×"
        );

    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        showAdminToast(
            "DELETE FAILED",
            error.message ||
            "Could not delete account.",
            "!",
            "error"
        );

    }

}


/* =========================================================
   TOGGLE STATUS
========================================================= */

async function toggleStatus(id) {

    const account =
        accounts.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!account) {

        showAdminToast(
            "ACCOUNT NOT FOUND",
            "The account could not be found.",
            "!",
            "error"
        );

        return;

    }


    const newStatus =
        account.status ===
        "sold"
            ? "available"
            : "sold";


    const updatedAccount = {

        name:
            account.name,

        game:
            account.game,

        server:
            account.server,

        level:
            account.level,

        evo:
            account.evo,

        emotes:
            account.emotes,

        bundles:
            account.bundles,

        price:
            account.price,

        description:
            account.description,

        image:
            account.image,

        featured:
            account.featured,

        status:
            newStatus

    };


    try {

        const response =
            await fetch(
                `${API_URL}/accounts/${id}`,
                {

                    method:
                        "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedAccount
                        )

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Status update failed"
            );

        }


        await loadAccounts();


        showAdminToast(
            newStatus === "sold"
                ? "ACCOUNT SOLD"
                : "ACCOUNT AVAILABLE",

            newStatus === "sold"
                ? "Account status changed to sold."
                : "Account is now available for sale.",

            "✓"
        );

    } catch (error) {

        console.error(
            error
        );


        showAdminToast(
            "UPDATE FAILED",
            error.message ||
            "Could not update account.",
            "!",
            "error"
        );

    }

}


/* =========================================================
   TOGGLE FEATURED
========================================================= */

async function toggleFeatured(id) {

    const account =
        accounts.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!account) {

        showAdminToast(
            "ACCOUNT NOT FOUND",
            "The account could not be found.",
            "!",
            "error"
        );

        return;

    }


    const updatedAccount = {

        name:
            account.name,

        game:
            account.game,

        server:
            account.server,

        level:
            account.level,

        evo:
            account.evo,

        emotes:
            account.emotes,

        bundles:
            account.bundles,

        price:
            account.price,

        description:
            account.description,

        image:
            account.image,

        status:
            account.status,

        featured:
            !account.featured

    };


    try {

        const response =
            await fetch(
                `${API_URL}/accounts/${id}`,
                {

                    method:
                        "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedAccount
                        )

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Featured update failed"
            );

        }


        await loadAccounts();


        showAdminToast(

            updatedAccount.featured
                ? "FEATURED ACCOUNT"
                : "FEATURE REMOVED",

            updatedAccount.featured
                ? "Account added to featured section."
                : "Account removed from featured section.",

            "★"

        );

    } catch (error) {

        console.error(
            error
        );


        showAdminToast(
            "UPDATE FAILED",
            error.message ||
            "Could not update featured status.",
            "!",
            "error"
        );

    }

}


/* =========================================================
   RENDER FEATURED ACCOUNTS
========================================================= */

function renderFeaturedAccounts() {

    const container =
        document.getElementById(
            "featuredAccountsList"
        );


    if (!container) return;


    const featured =
        accounts.filter(
            account =>
                account.featured === true
        );


    container.innerHTML =
        "";


    if (
        featured.length ===
        0
    ) {

        container.innerHTML = `

            <div style="
                padding:40px;
                text-align:center;
                color:rgba(255,255,255,.35);
            ">

                No featured accounts yet.

            </div>

        `;

        return;

    }


    featured.forEach(
        account => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-account";


            const image =
                account.image ||
                "";


            div.innerHTML = `

                <div class="admin-account-image">

                    ${
                        image
                            ? `
                                <img
                                    src="${escapeHTML(image)}"
                                    alt="${escapeHTML(account.name)}"
                                >
                            `
                            : `
                                <div class="no-image">
                                    NO IMAGE
                                </div>
                            `
                    }

                </div>


                <div class="admin-account-info">

                    <h3>
                        ${escapeHTML(
                            account.name
                        )}
                    </h3>


                    <p>

                        ${escapeHTML(
                            account.game ||
                            "FREE FIRE"
                        )}

                        •

                        ${escapeHTML(
                            account.server ||
                            "SG"
                        )}

                        • Level

                        ${escapeHTML(
                            account.level ||
                            "N/A"
                        )}

                    </p>


                    <div class="admin-details">

                        <span>
                            Evo Guns:
                            <b>
                                ${escapeHTML(
                                    account.evo ||
                                    "0"
                                )}
                            </b>
                        </span>


                        <span>
                            Emotes:
                            <b>
                                ${escapeHTML(
                                    account.emotes ||
                                    "0"
                                )}
                            </b>
                        </span>


                        <span>
                            Bundles:
                            <b>
                                ${escapeHTML(
                                    account.bundles ||
                                    "0"
                                )}
                            </b>
                        </span>

                    </div>


                    <div class="price">

                        Rs.
                        ${Number(
                            account.price || 0
                        ).toLocaleString()}

                    </div>

                </div>


                <div class="account-actions">

                    <button
                        class="edit"
                        onclick="editAccount('${escapeHTML(account.id)}')"
                    >
                        Edit
                    </button>


                    <button
                        onclick="toggleFeatured('${escapeHTML(account.id)}')"
                    >
                        Remove Featured
                    </button>

                </div>

            `;


            container.appendChild(
                div
            );

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        "sahanyaAdmin"
    );


    window.location.href =
        "index.html";

}


/* =========================================================
   ADMIN LOADER
========================================================= */

let adminProgress =
    0;


const adminLoader =
    document.getElementById(
        "adminLoader"
    );


const adminLoaderBar =
    document.getElementById(
        "adminLoaderBar"
    );


const adminLoaderPercent =
    document.getElementById(
        "adminLoaderPercent"
    );


const adminLoading =
    setInterval(
        () => {

            adminProgress +=
                Math.floor(
                    Math.random() * 8
                ) + 2;


            if (
                adminProgress >=
                100
            ) {

                adminProgress =
                    100;


                clearInterval(
                    adminLoading
                );


                setTimeout(
                    () => {

                        adminLoader
                            ?.classList
                            .add(
                                "hide"
                            );

                    },
                    450
                );

            }


            if (
                adminLoaderBar
            ) {

                adminLoaderBar.style.width =
                    adminProgress +
                    "%";

            }


            if (
                adminLoaderPercent
            ) {

                adminLoaderPercent.textContent =
                    adminProgress +
                    "%";

            }

        },
        55
    );


/* =========================================================
   INITIAL LOAD
========================================================= */

loadAccounts();

updateImagePreview();