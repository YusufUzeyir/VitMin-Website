 // HTML elementlerini seç
 const veriSection = document.querySelector('.veri-section');
 const yukleSection = document.querySelector('.yukle-section');
 const duyuruSection = document.querySelector('.duyuru-ekle-section');


 // İlk başta veri-section görüntülensin
 veriSection.style.display = 'block';
 yukleSection.style.display = 'none';
 duyuruSection.style.display = 'none';


 // Navbar elementlerini seç
 const veriLink = document.querySelector('.nav-list li:nth-child(2) a');
 const yukleLink = document.querySelector('.nav-list li:nth-child(3) a');
 const duyuruLink = document.querySelector('.nav-list li:nth-child(4) a');



 // Veri linkine tıklanınca sadece veri-section gösterilsin
 veriLink.addEventListener('click', function() {
   veriSection.style.display = 'block';
   yukleSection.style.display = 'none';
   duyuruSection.style.display = 'none';
 });



 // Ürün Yükleme linkine tıklanınca sadece yukle-section gösterilsin
 yukleLink.addEventListener('click', function() {
   veriSection.style.display = 'none';
   yukleSection.style.display = 'block';
   duyuruSection.style.display = 'none';
 });

 // Duyuru Ekleme linkine tıklanınca sadece yukle-section gösterilsin
 duyuruLink.addEventListener('click', function() {
  veriSection.style.display = 'none';
  yukleSection.style.display = 'none';
  duyuruSection.style.display = 'block';
});

 window.addEventListener("DOMContentLoaded",() => {
	const upload = new UploadModal("#upload");
});

class UploadModal {
    filename = "";
    isCopying = false;
    isUploading = false;
    progress = 0;
    progressTimeout = null;
    state = 0;

    constructor(el) {
        this.el = document.querySelector(el);
        this.el?.addEventListener("click",this.action.bind(this));
        this.el?.querySelector("#file")?.addEventListener("change",this.fileHandle.bind(this));
    }
    action(e) {
        this[e.target?.getAttribute("data-action")]?.();
        this.stateDisplay();
    }
    cancel() {
        this.isUploading = false;
        this.progress = 0;
        this.progressTimeout = null;
        this.state = 0;
        this.stateDisplay();
        this.progressDisplay();
        this.fileReset();
    }
    async copy() {
        const copyButton = this.el?.querySelector("[data-action='copy']");

        if (!this.isCopying && copyButton) {
            // disable
            this.isCopying = true;
            copyButton.style.width = `${copyButton.offsetWidth}px`;
            copyButton.disabled = true;
            copyButton.textContent = "Kopyalandı!";
            navigator.clipboard.writeText(this.filename);
            await new Promise(res => setTimeout(res, 1000));
            // reenable
            this.isCopying = false;
            copyButton.removeAttribute("style");
            copyButton.disabled = false;
            copyButton.textContent = "Bağlantıyı Kopyala";
        }
    }
    fail() {
        this.isUploading = false;
        this.progress = 0;
        this.progressTimeout = null;
        this.state = 2;
        this.stateDisplay();
    }
    file() {
        this.el?.querySelector("#file").click();
    }
    fileDisplay(name = "") {
        // update the name
        this.filename = name;

        const fileValue = this.el?.querySelector("[data-file]");
        if (fileValue) fileValue.textContent = this.filename;

        // show the file
        this.el?.setAttribute("data-ready", this.filename ? "true" : "false");
    }
    fileHandle(e) {
        return new Promise(() => {
            const { target } = e;
            if (target?.files.length) {
                let reader = new FileReader();
                reader.onload = e2 => {
                    this.fileDisplay(target.files[0].name);
                };
                reader.readAsDataURL(target.files[0]);
            }
        });
    }
    fileReset() {
        const fileField = this.el?.querySelector("#file");
        if (fileField) fileField.value = null;

        this.fileDisplay();
    }
    progressDisplay() {
        const progressValue = this.el?.querySelector("[data-progress-value]");
        const progressFill = this.el?.querySelector("[data-progress-fill]");
        const progressTimes100 = Math.floor(this.progress * 100);

        if (progressValue) progressValue.textContent = `${progressTimes100}%`;
        if (progressFill) progressFill.style.transform = `translateX(${progressTimes100}%)`;
    }
    async progressLoop() {
        this.progressDisplay();

        if (this.isUploading) {
            if (this.progress === 0) {
                await new Promise(res => setTimeout(res, 1000));
                // fail randomly
                if (!this.isUploading) {
                    return;
                } else if (Utils.randomInt(0,2) === 0) {
                    this.fail();
                    return;
                }
            }
            // …or continue with progress
            if (this.progress < 1) {
                this.progress += 0.01;
                this.progressTimeout = setTimeout(this.progressLoop.bind(this), 50);
            } else if (this.progress >= 1) {
                this.progressTimeout = setTimeout(() => {
                    if (this.isUploading) {
                        this.success();
                        this.stateDisplay();
                        this.progressTimeout = null;
                    }
                }, 250);
            }
        }
    }
    stateDisplay() {
        this.el?.setAttribute("data-state", `${this.state}`);
    }
    success() {
        this.isUploading = false;
        this.state = 3;
        this.stateDisplay();
    }
    upload() {
        if (!this.isUploading) {
            this.isUploading = true;
            this.progress = 0;
            this.state = 1;
            this.progressLoop();
        }
    }
}

class Utils {
    static randomInt(min = 0,max = 2**32) {
        const percent = crypto.getRandomValues(new Uint32Array(1))[0] / 2**32;
        const relativeValue = (max - min) * percent;

        return Math.round(min + relativeValue);
    }
}



let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");

closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange();
});

searchBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange();
});

function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  }
}

new Chart(document.getElementById("doughnut-chart"), {
  type: "doughnut",
  data: {
    labels: ["C", "E", "B12", "K", "Multivitamin", "Omega3", "Demir", "Çinko", "Magnezyum"],
    datasets: [
      {
        label: "Population (millions)",
        backgroundColor: ["#0079FF", "#FF0060", "#F6FA70", "#172663", "#00e699", "#00d6cb", "#83A2FF", "#FF6C22", "#B931FC"],
        data: [2478, 5267, 1733, 2130, 3540, 1526, 4000, 4712, 3090],
      },
    ],
  },
  options: {
    title: {
      display: false,
      text: "",
    },
  },
});

new Chart(document.getElementById("line-chart"), {
  type: "line",
  data: {
    labels: [
      "",
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ],
    datasets: [
      {
        data: [
          86, 114, 106, 200, 310, 240, 150, 221, 783, 978, 1278, 1593, 2015,
        ],
        label: "Vitaminler",
        borderColor: "#0079FF",
        fill: true,
      },
      {
        data: [
          86, 200, 432, 820, 1220, 1030, 840, 530, 508, 784, 600, 520, 615,
        ],
        label: "Mineraller",
        borderColor: "#FF0060",
        fill: true,
      },
      {
        data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433, 550, 640, 1115],
        label: "Balık Yğları",
        borderColor: "#F6FA70",
        fill: true,
      },
    ],
  },
  options: {
    title: {
      display: false,
      text: "",
    },
  },
});

new Chart(document.getElementById("bar-chart"), {
  type: "bar",
  data: {
    labels: ["İstanbul", "Ankara", "Zonguldak", "Mersin", "Çanakkale", "Muğla", "Eskişehir", "Konya"],
    datasets: [
      {
        label: "2023 En çok sipariş veren 8 şehir",
        backgroundColor: [
          "#293462",
          "#1CD6CE",
          "#FEDB39",
          "#D61C4E",
          "#00FFAB",
          "#B931FC",
          "#FF6C22",
          "#83A2FF",
        ],
        data: [488, 399, 457, 444, 510, 418, 500, 350],
      },
    ],
  },
  options: {
    legend: { display: false },
    title: {
      display: false,
      text: "",
    },
  },
});
