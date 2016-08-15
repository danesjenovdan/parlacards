function makeSwitchEvent(acronym) {
    $('#partyswitch-' + acronym).on('click', function() {
        $(this).toggleClass('turnedon');
        if (d3.select('#kompashull' + acronym).classed('hidden')) {
            d3.select('#kompashull' + acronym).classed('hidden', false);
        } else {
            d3.select('#kompashull' + acronym).classed('hidden', true);
        }
    });
}

function groupBy(array, f) {
    var groups = {};
    array.forEach(function(o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function(group) {
        return groups[group];
    })
}

var data = [ { "person" : { "gender" : "f",
        "gov_id" : "P265",
        "id" : 46,
        "name" : "Lilijana Kozlovič",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 149.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P262",
        "id" : 42,
        "name" : "Miha Kordiš",
        "party" : { "acronym" : "ZL",
            "id" : 8,
            "name" : "PS Združena Levica"
          }
      },
    "score" : 202.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 112,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 231.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P235",
        "id" : 7,
        "name" : "Mirjam Bon Klanjšček",
        "party" : { "acronym" : "ZAAB",
            "id" : 4,
            "name" : "PS Zavezništvo Alenke Bratušek"
          }
      },
    "score" : 514.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P196",
        "id" : 65,
        "name" : "Marko Pogačnik",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 581.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P122",
        "id" : 37,
        "name" : "Franc Jurša",
        "party" : { "acronym" : "DeSUS",
            "id" : 3,
            "name" : "PS Demokratska Stranka Upokojencev Slovenije"
          }
      },
    "score" : 606.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P176",
        "id" : 34,
        "name" : "Ivan Hršak",
        "party" : { "acronym" : "DeSUS",
            "id" : 3,
            "name" : "PS Demokratska Stranka Upokojencev Slovenije"
          }
      },
    "score" : 621.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 129,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 633.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P025",
        "id" : 36,
        "name" : "Janez Janša",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 786.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P129",
        "id" : 49,
        "name" : "Zvonko Lah",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 843.0
  },
  { "person" : { "gender" : "m",
        "gov_id" : "P005",
        "id" : 4,
        "name" : "Roberto Battelli",
        "party" : { "acronym" : "IMNS",
            "id" : 2,
            "name" : "PS italijanske in madžarske narodne skupnosti"
          }
      },
    "score" : 843.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P272",
        "id" : 57,
        "name" : "Dragan Matić",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 853.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P261",
        "id" : 41,
        "name" : "Benedikt Kopmajer",
        "party" : { "acronym" : "DeSUS",
            "id" : 3,
            "name" : "PS Demokratska Stranka Upokojencev Slovenije"
          }
      },
    "score" : 880.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 108,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 883.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P273",
        "id" : 58,
        "name" : "Luka Mesec",
        "party" : { "acronym" : "ZL",
            "id" : 8,
            "name" : "PS Združena Levica"
          }
      },
    "score" : 913.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 122,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 932.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 104,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 936.0
  },
  { "person" : { "gender" : "m",
        "gov_id" : "P242",
        "id" : 8,
        "name" : "Tilen Božič",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 945.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P238",
        "id" : 54,
        "name" : "Anže Logar",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 968.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P238",
        "id" : 54,
        "name" : "Anže Logar",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 968.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "ministrstvo_za_obrambo/ministrica_za_obrambo/",
        "id" : 38,
        "name" : "Andreja Katič",
        "party" : { "acronym" : "SD",
            "id" : 7,
            "name" : "PS Socialni Demokrati"
          }
      },
    "score" : 974.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P256",
        "id" : 31,
        "name" : "Matjaž Hanžek",
        "party" : { "acronym" : "ZL",
            "id" : 8,
            "name" : "PS Združena Levica"
          }
      },
    "score" : 1009.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P256",
        "id" : 31,
        "name" : "Matjaž Hanžek",
        "party" : { "acronym" : "ZL",
            "id" : 8,
            "name" : "PS Združena Levica"
          }
      },
    "score" : 1009.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P269",
        "id" : 52,
        "name" : "Marinka Levičar",
        "party" : { "acronym" : "DeSUS",
            "id" : 3,
            "name" : "PS Demokratska Stranka Upokojencev Slovenije"
          }
      },
    "score" : 1012.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 130,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 1147.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P016",
        "id" : 26,
        "name" : "Branko Grims",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 1219.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "ministrstvo_za_kulturo/ministrica_za_kulturo/",
        "id" : 5,
        "name" : "Julijana Bizjak Mlakar",
        "party" : { "acronym" : "DeSUS",
            "id" : 3,
            "name" : "PS Demokratska Stranka Upokojencev Slovenije"
          }
      },
    "score" : 1257.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P255",
        "id" : 29,
        "name" : "Primož Hainz",
        "party" : { "acronym" : "DeSUS",
            "id" : 3,
            "name" : "PS Demokratska Stranka Upokojencev Slovenije"
          }
      },
    "score" : 1287.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 134,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 1287.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P268",
        "id" : 51,
        "name" : "Suzana Lep Šimenko",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 1291.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P268",
        "id" : 51,
        "name" : "Suzana Lep Šimenko",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 1291.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P186",
        "id" : 45,
        "name" : "Marjana Kotnik Poropat",
        "party" : { "acronym" : "DeSUS",
            "id" : 3,
            "name" : "PS Demokratska Stranka Upokojencev Slovenije"
          }
      },
    "score" : 1303.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P193",
        "id" : 63,
        "name" : "Ljudmila Novak",
        "party" : { "acronym" : "NSI",
            "id" : 6,
            "name" : "PS Nova Slovenija"
          }
      },
    "score" : 1315.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 107,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 1328.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P023",
        "id" : 35,
        "name" : "Eva Irgl",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 1360.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P171",
        "id" : 20,
        "name" : "Viktor Erjavec Karl",
        "party" : { "acronym" : "DeSUS",
            "id" : 3,
            "name" : "PS Demokratska Stranka Upokojencev Slovenije"
          }
      },
    "score" : 1401.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P260",
        "id" : 40,
        "name" : "Anita Koleša",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 1446.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P248",
        "id" : 18,
        "name" : "Bojan Dobovšek",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 1451.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 128,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 1466.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 127,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 1523.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P259",
        "id" : 39,
        "name" : "Aleksander Kavčič",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 1593.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P253",
        "id" : 27,
        "name" : "Irena Grošelj Košnik",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 1635.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P277",
        "id" : 64,
        "name" : "Bojan Podkrajšek",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 1652.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P225",
        "id" : 15,
        "name" : "Andrej Čuš",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 1721.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 109,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 1724.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P275",
        "id" : 61,
        "name" : "Bojana Muršič",
        "party" : { "acronym" : "SD",
            "id" : 7,
            "name" : "PS Socialni Demokrati"
          }
      },
    "score" : 1758.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 102,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 1763.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P239",
        "id" : 2,
        "name" : "Anja Bah Žibert",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 1773.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P252",
        "id" : 23,
        "name" : "Jelka Godec",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 1776.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P263",
        "id" : 43,
        "name" : "Ksenija Korenjak Kramar",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 1857.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P257",
        "id" : 33,
        "name" : "Mitja Horvat",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 1893.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P018",
        "id" : 30,
        "name" : "Matjaž Han",
        "party" : { "acronym" : "SD",
            "id" : 7,
            "name" : "PS Socialni Demokrati"
          }
      },
    "score" : 1905.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 101,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 1973.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P264",
        "id" : 44,
        "name" : "Irena Kotnik",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 2003.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P244",
        "id" : 12,
        "name" : "Nada Brinovšek",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 2003.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 135,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2032.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 135,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2032.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 113,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2036.0
  },
  { "person" : { "gender" : "m",
        "gov_id" : "P167",
        "id" : 10,
        "name" : "Franc Breznik",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 2040.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 133,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2093.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 105,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2109.0
  },
  { "person" : { "gender" : "m",
        "gov_id" : "P243",
        "id" : 11,
        "name" : "Milan Brglez",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 2122.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 138,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2126.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P279",
        "id" : 68,
        "name" : "Ivan Prelog",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 2177.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P187",
        "id" : 53,
        "name" : "Tomaž Lisec",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 2180.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P247",
        "id" : 16,
        "name" : "Erika Dekleva",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 2192.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P251",
        "id" : 22,
        "name" : "Tomaž Gantar",
        "party" : { "acronym" : "DeSUS",
            "id" : 3,
            "name" : "PS Demokratska Stranka Upokojencev Slovenije"
          }
      },
    "score" : 2308.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 131,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2312.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P166",
        "id" : 9,
        "name" : "Alenka Bratušek",
        "party" : { "acronym" : "ZAAB",
            "id" : 4,
            "name" : "PS Zavezništvo Alenke Bratušek"
          }
      },
    "score" : 2436.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P267",
        "id" : 50,
        "name" : "Franc Laj",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 2474.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P249",
        "id" : 19,
        "name" : "Marjan Dolinšek",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 2498.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 103,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2524.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P020",
        "id" : 32,
        "name" : "Jožef Horvat",
        "party" : { "acronym" : "NSI",
            "id" : 6,
            "name" : "PS Nova Slovenija"
          }
      },
    "score" : 2542.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 126,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2555.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P274",
        "id" : 60,
        "name" : "Jasna Murgel",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 2703.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 132,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2770.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 98,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 2784.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P191",
        "id" : 59,
        "name" : "Jani Möderndorfer",
        "party" : { "acronym" : "ZAAB",
            "id" : 4,
            "name" : "PS Zavezništvo Alenke Bratušek"
          }
      },
    "score" : 2890.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P280",
        "id" : 69,
        "name" : "Uroš Prikl",
        "party" : { "acronym" : "DeSUS",
            "id" : 3,
            "name" : "PS Demokratska Stranka Upokojencev Slovenije"
          }
      },
    "score" : 2958.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P271",
        "id" : 56,
        "name" : "Klavdija Markež",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 2984.0
  },
  { "person" : { "gender" : "m",
        "gov_id" : "predsednik_vlade/dr_miro_cerar/",
        "id" : 13,
        "name" : "Miro Cerar",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 2992.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 114,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 3172.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 106,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 3235.0
  },
  { "person" : { "gov_id" : "unknown",
        "id" : 140,
        "name" : "unknown",
        "party" : { "acronym" : "unknown",
            "id" : "unknown",
            "name" : "unknown"
          }
      },
    "score" : 3268.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P241",
        "id" : 6,
        "name" : "Srečko Blažič",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 3383.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P169",
        "id" : 17,
        "name" : "Iva Dimic",
        "party" : { "acronym" : "NSI",
            "id" : 6,
            "name" : "PS Nova Slovenija"
          }
      },
    "score" : 3416.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P240",
        "id" : 3,
        "name" : "Urška Ban",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 3502.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P098",
        "id" : 66,
        "name" : "Marijan Pojbič",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 3534.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P098",
        "id" : 66,
        "name" : "Marijan Pojbič",
        "party" : { "acronym" : "SDS",
            "id" : 5,
            "name" : "PS Slovenska Demokratska Stranka"
          }
      },
    "score" : 3534.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P276",
        "id" : 62,
        "name" : "Matjaž Nemec",
        "party" : { "acronym" : "SD",
            "id" : 7,
            "name" : "PS Socialni Demokrati"
          }
      },
    "score" : 3539.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P278",
        "id" : 67,
        "name" : "Andreja Potočnik",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 4410.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P250",
        "id" : 21,
        "name" : "Marko Ferluga",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 4517.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "P246",
        "id" : 14,
        "name" : "Tanja Cink",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 4533.0
  },
  { "person" : { "gender" : "f",
        "gov_id" : "ministrstvo_za_gospodarski_razvoj_in_tehnologijo/drzavna_sekretarka_margareta_gucek_zakosek/",
        "id" : 28,
        "name" : "Margareta Guček Zakošek",
        "party" : { "acronym" : "SMC",
            "id" : 1,
            "name" : "PS Stranka modernega centra"
          }
      },
    "score" : 4554.0
  }
];

var groupedData = groupBy(data, function(item) {
    return [item.person.party.acronym]
});

var margin = {
        top: 50,
        right: 300,
        bottom: 50,
        left: 50
    },
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

// var x = d3.scale.linear()
//     .range([0, width]).nice();

var x = d3.scale.linear()
  .range( [margin.left, width ] ).nice();

var xCat = "score";

data.forEach(function(d) {
    d.score = +d.score;
});

var xMax = d3.max(data, function(d) {
        return d[xCat];
    }) * 1.05;
var xMin = d3.min(data, function(d) {
        return d[xCat];
    });
var xMin = xMin > 0 ? 0 : xMin;

x.domain([xMin, xMax]);

var nodes = data.map(function(node, index) {
    return {
        person: node.person,
        score: node.score,
        idealradius: node.score / 100,
        radius: 15,
        // Give each node a random color.
        color: '#ff7f0e',
        // Set the node's gravitational centerpoint.
        idealcx: x(node.score),
        idealcy: height / 2,
        x: x(node.score),
        // Add some randomization to the placement;
        // nodes stacked on the same point can produce NaN errors.
        y: height / 2 + Math.random()
    };
});

var force = d3.layout.force()
  .nodes(nodes)
  .size([width, height])
  .gravity(0)
  .charge(0)
  .on("tick", tick)
  .start();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

/**
 * On a tick, apply custom gravity, collision detection, and node placement.
 */
function tick(e) {
  for ( i = 0; i < nodes.length; i++ ) {
    var node = nodes[i];
    /*
     * Animate the radius via the tick.
     *
     * Typically this would be performed as a transition on the SVG element itself,
     * but since this is a static force layout, we must perform it on the node.
     */
    // node.radius = node.idealradius - node.idealradius * e.alpha * 10;
    node = gravity(.2 * e.alpha)(node);
    node = collide(.5)(node);
    node.cx = node.x;
    node.cy = node.y;
  }
}

/**
 * On a tick, move the node towards its desired position,
 * with a preference for accuracy of the node's x-axis placement
 * over smoothness of the clustering, which would produce inaccurate data presentation.
 */
function gravity(alpha) {
  return function(d) {
    d.y += (d.idealcy - d.y) * alpha;
    d.x += (d.idealcx - d.x) * alpha * 3;
    return d;
  };
}

/**
 * On a tick, resolve collisions between nodes.
 */
 var maxRadius = 15;
 var padding = 5;
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
    return d;
  };
}

/**
 * Run the force layout to compute where each node should be placed,
 * then replace the loading text with the graph.
 */
function renderGraph() {
  // Run the layout a fixed number of times.
  // The ideal number of times scales with graph complexity.
  // Of course, don't run too long—you'll hang the page!
  force.start();
  for (var i = 100; i > 0; --i) force.tick();
  force.stop();

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + ( margin.top + ( height * 3/4 ) ) + ")")
    .call(xAxis);

  var circle = svg.selectAll('.dot')
    .data(nodes)
    .enter().append('g')
    .append("circle")
    // .enter().append('svg:image')
    //     .attr('xlink:href', function(d) {
    //         return 'https://cdn.parlameter.si/v1/img/people/' + d.person.gov_id + '.png';
    //     })
    //     .attr('x', function(d) { return d.x })
    //     .attr('y', function(d) { return d.y })
    //     .attr('height', 30)
    //     .attr('width', 30)
    // .style("fill", function(d) { return d.color; })
    .attr("cx", function(d) { return d.x} )
    .attr("cy", function(d) { return d.y} )
    .attr("r", function(d) { return d.radius} )
    .classed("dot", true)
    .attr('id', function(d) {
        return '_' + d.person.id;
    })
    // .style('border', '3px solid')
    .style("stroke", function(d) {
        return color(d.person.party.acronym.replace(' ', '_'));
    })
    .style('fill', function(d) {
        return 'url(#' + d.person.gov_id + ')'
    })
    .on('click', function(d, i) {
        // var element = d3.select('#_' + d.person.id);
        // if (element.classed('selected')) {
        //     removeSingleHull(d);
        //     element.classed('selected', false);
        // } else {
        drawSingleHull(d);
        //     element.classed('selected', true);
        // }
    });
}

var parties = [];
for (group in groupedData) {
    parties.push(groupedData[group][0].person.party.acronym.replace(' ', '_'));
}

var color = d3.scale.ordinal()
    .range(["#8FCFEE", "#4FB5E6", "#AA7375", "#534961", "#4F6379", "#5388AA", "#D9776B", "#BA594C"]);

var svg = d3.select("#vocabulary-chart")
    .append("svg")
    .attr('viewBox', '0 0 700 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append("g");

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

svg.selectAll(".tick")
    .each(function(d, i) {
        this.remove();
    });

var objects = svg.append("svg")
    .classed("objects", true)
    .attr("width", width)
    .attr("height", height);

var parties = objects.selectAll('g')
    .data(groupedData)
    .enter()
    .append('g')
    .attr('id', function(d, i) {
        return 'kompasgroup' + d[0].person.party.acronym.replace(' ', '_');
    });

var defs = svg.append('defs').attr('id', 'thedefs');

for (i in data) {
    defs.append("pattern")
        .attr("id", data[i].person.gov_id)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", 0)
        .attr("y", 0)
        .append("image")
        .attr("xlink:href", 'https://cdn.parlameter.si/v1/img/people/' + data[i].person.gov_id + '.png')
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", 0)
        .attr("y", 0);
}

// for (group in groupedData) {
//
//     var currentselection = d3.select('#kompasgroup' + groupedData[group][0].person.party.acronym.replace(' ', '_'))
//         .selectAll('.dot')
//         .data(groupedData[group])
//         .enter()
//         .append("circle")
//         .classed("dot", true)
//         .attr('id', function(d) {
//             return '_' + d.person.id;
//         })
//         .attr("r", function(d) {
//             return 20;
//         })
//         .attr("transform", transform)
//         // .style('border', '3px solid')
//         .style("stroke", function(d) {
//             return color(d.person.party.acronym.replace(' ', '_'));
//         })
//         .style('fill', function(d) {
//             return 'url(#' + d.person.gov_id + ')'
//         })
//         .on('click', function(d, i) {
//             // var element = d3.select('#_' + d.person.id);
//             // if (element.classed('selected')) {
//             //     removeSingleHull(d);
//             //     element.classed('selected', false);
//             // } else {
//             drawSingleHull(d);
//             //     element.classed('selected', true);
//             // }
//         });
//     // .style('filter', 'url(#glow)');
//     // .on('mouseover', overGroup)
//     // .off('mouseover', offGroup);
//
//     drawHull(currentselection, groupedData[group]);
//
// }


function overGroup() {};

function offGroup() {};

function drawSingleHull(datum) {

    // create card
    $('.kompas-people').append('<div class="kompas-person" id="personcard' + datum.person.id + '" data-id="' + datum.person.id + '">' + datum.person.name + '</div>');
    $('#personcard' + datum.person.id).on('click', function() {
        $('#singlehull' + $(this).data('id')).remove();
        $(this).remove();
    });

    // create hull
    var hull = objects.append('path')
        .classed('hull', true)
        .classed('singlehull', true)
        .attr('data-parent', '_' + datum.person.id)
        .attr('id', function() {
            return 'singlehull' + datum.person.id;
        })
        .attr('data-id', datum.person.id);

    var vertices = [
        [x(datum[xCat]), y(datum[yCat])]
    ];

    hull.datum(vertices)
        .attr("d", function(d) {
            return "M" + d[0][0] + ',' + d[0][1] + "L" + (d[0][0] + 0.1) + ',' + d[0][1] + "Z";
        })
        .style('fill', function(d) {
            return color(datum.person.party.acronym.replace(' ', '_'));
        })
        .style('stroke', function(d) {
            return color(datum.person.party.acronym.replace(' ', '_'));
        })
        .on('click', function() {
            d3.select('#personcard' + d3.select(this).attr('data-id')).remove();
            d3.select(this).remove();
        });
}

function drawHull(group, dataset) {
    var hull = objects.append("path")
        .attr("class", "hull")
        .attr('id', function() {
            return 'kompashull' + dataset[0].person.party.acronym.replace(' ', '_');
        })
        .classed('hidden', true);

    var vertices = dataset.map(function(d) {
        return [x(d[xCat]), y(d[yCat])];
    });

    if (vertices.length > 2) {
        hull.datum(d3.geom.hull(vertices))
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    } else if (vertices.length === 2) {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    } else {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d[0][0] + ',' + d[0][1] + "L" + (d[0][0] + 0.1) + ',' + d[0][1] + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    }

    makeSwitchEvent(dataset[0].person.party.acronym.replace(' ', '_'));
}

function redrawHull(group, dataset) {
    var hull = objects.select("#kompashull" + dataset[0].person.party.acronym.replace(' ', '_'));

    var vertices = dataset.map(function(d) {
        return [x(d[xCat]), y(d[yCat])];
    });

    if (vertices.length > 2) {
        hull.datum(d3.geom.hull(vertices))
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    } else if (vertices.length === 2) {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    } else {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d[0][0] + ',' + d[0][1] + "L" + (d[0][0] + 0.01) + ',' + d[0][1] + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    }
}

renderGraph();
