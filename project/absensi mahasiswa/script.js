const historyDiv =
document.getElementById("history");

function updateClock(){

    const now =
    new Date();

    document.getElementById(
        "clock"
    ).textContent =
    now.toLocaleTimeString();

}

setInterval(
    updateClock,
    1000
);

updateClock();

function tambahAbsensi(){

    const nama =
    document.getElementById(
        "nama"
    ).value;

    const nim =
    document.getElementById(
        "nim"
    ).value;

    const status =
    document.getElementById(
        "status"
    ).value;

    if(
        nama === "" ||
        nim === ""
    ){
        showToast(
            "Lengkapi Data!"
        );
        return;
    }

    const data = {

        nama,
        nim,
        status

    };

    let absensi =
    JSON.parse(
        localStorage.getItem(
            "absensi"
        )
    ) || [];

    absensi.push(data);

    localStorage.setItem(
        "absensi",
        JSON.stringify(absensi)
    );

    loadData();

    document.getElementById(
        "nama"
    ).value = "";

    document.getElementById(
        "nim"
    ).value = "";

    showToast(
        "Absensi Berhasil Disimpan"
    );

}

function loadData(){

    let absensi =
    JSON.parse(
        localStorage.getItem(
            "absensi"
        )
    ) || [];

    historyDiv.innerHTML = "";

    let hadir = 0;
    let izin = 0;
    let alpha = 0;

    absensi.forEach((item,index)=>{

        if(item.status==="Hadir") hadir++;

        if(item.status==="Izin") izin++;

        if(item.status==="Alpha") alpha++;

        historyDiv.innerHTML += `

        <div class="history-card">

            <h3>${item.nama}</h3>

            <p>NIM : ${item.nim}</p>

            <p class="
${item.status.toLowerCase()}
">
${item.status}
</p>

            <button onclick="hapusData(${index})">
                🗑 Hapus
            </button>

        </div>

        `;

    });

    document.getElementById(
        "totalData"
    ).textContent =
    absensi.length;

    document.getElementById(
        "hadirCount"
    ).textContent =
    hadir;

    document.getElementById(
        "izinCount"
    ).textContent =
    izin;

    document.getElementById(
        "alphaCount"
    ).textContent =
    alpha;

    const percent =
    absensi.length
    ?
    Math.round(
        (hadir / absensi.length) * 100
    )
    : 0;

    document.getElementById(
        "attendancePercent"
    ).textContent =
    percent + "%";

    document.getElementById(
        "progressFill"
    ).style.width =
    percent + "%";

}

function showToast(msg){

    const toast =
    document.getElementById(
        "toast"
    );

    toast.textContent =
    msg;

    toast.style.opacity = 1;

    setTimeout(()=>{

        toast.style.opacity = 0;

    },2000);

}

document
.getElementById("search")
.addEventListener("keyup",e=>{

    const value =
    e.target.value
    .toLowerCase();

    document
    .querySelectorAll(
        ".history-card"
    )
    .forEach(card=>{

        card.style.display =
        card.innerText
        .toLowerCase()
        .includes(value)

        ? "block"
        : "none";

    });

});

loadData();
particlesJS("particles-js",{

  particles:{

    number:{
      value:80
    },

    color:{
      value:"#38bdf8"
    },

    line_linked:{
      enable:true,
      color:"#38bdf8"
    },

    move:{
      speed:2
    }

  }

});
function hapusData(index){

    let absensi =
    JSON.parse(
        localStorage.getItem(
            "absensi"
        )
    ) || [];

    absensi.splice(index,1);

    localStorage.setItem(
        "absensi",
        JSON.stringify(absensi)
    );

    loadData();

}
function exportCSV(){

    let data =
    JSON.parse(
        localStorage.getItem(
            "absensi"
        )
    ) || [];

    let csv =
    "Nama,NIM,Status\n";

    data.forEach(item=>{

        csv +=
        `${item.nama},
        ${item.nim},
        ${item.status}\n`;

    });

    const blob =
    new Blob([csv],{
        type:"text/csv"
    });

    const a =
    document.createElement("a");

    a.href =
    URL.createObjectURL(blob);

    a.download =
    "absensi.csv";

    a.click();

}