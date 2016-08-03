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

var data = [{
    "person": {
        "gov_id": "P239",
        "id": 2,
        "name": "Anja Bah Žibert",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.18508622697468333,
        "vT2": -0.066331394853444886
    }
}, {
    "person": {
        "gov_id": "P240",
        "id": 3,
        "name": "Urška Ban",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.079765762131727508,
        "vT2": -0.14044998403605635
    }
}, {
    "person": {
        "gov_id": "P005",
        "id": 4,
        "name": "Roberto Battelli",
        "party": {
            "acronym": "IMNS",
            "id": 2,
            "name": "PS italijanske in madžarske narodne skupnosti"
        }
    },
    "score": {
        "vT1": 0.084415926648231054,
        "vT2": -0.073961472030345587
    }
}, {
    "person": {
        "gov_id": "P235",
        "id": 7,
        "name": "Mirjam Bon Klanjšček",
        "party": {
            "acronym": "PS NP",
            "id": 97,
            "name": "PS nepovezanih poslancev"
        }
    },
    "score": {
        "vT1": 0.066496237608380346,
        "vT2": -0.087995090070651372
    }
}, {
    "person": {
        "gov_id": "P242",
        "id": 8,
        "name": "Tilen Božič",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.059795187761396362,
        "vT2": -0.12989152200790691
    }
}, {
    "person": {
        "gov_id": "P166",
        "id": 9,
        "name": "Alenka Bratušek",
        "party": {
            "acronym": "PS NP",
            "id": 97,
            "name": "PS nepovezanih poslancev"
        }
    },
    "score": {
        "vT1": 0.084652536170635742,
        "vT2": -0.075357573840636433
    }
}, {
    "person": {
        "gov_id": "P167",
        "id": 10,
        "name": "Franc Breznik",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.17283581007704818,
        "vT2": -0.060989358236445405
    }
}, {
    "person": {
        "gov_id": "P243",
        "id": 11,
        "name": "Milan Brglez",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.061065420570990098,
        "vT2": -0.13289884902961918
    }
}, {
    "person": {
        "gov_id": "P244",
        "id": 12,
        "name": "Nada Brinovšek",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.17919305299474148,
        "vT2": -0.068337578770216692
    }
}, {
    "person": {
        "gov_id": "P246",
        "id": 14,
        "name": "Tanja Cink",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.036536318380515631,
        "vT2": -0.1114865218813364
    }
}, {
    "person": {
        "gov_id": "P225",
        "id": 15,
        "name": "Andrej Čuš",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.16770240931984015,
        "vT2": -0.06038783210343697
    }
}, {
    "person": {
        "gov_id": "P247",
        "id": 16,
        "name": "Erika Dekleva",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.069132999611960677,
        "vT2": -0.12917685705259405
    }
}, {
    "person": {
        "gov_id": "P169",
        "id": 17,
        "name": "Iva Dimic",
        "party": {
            "acronym": "NSI",
            "id": 6,
            "name": "PS Nova Slovenija"
        }
    },
    "score": {
        "vT1": 0.13294418999098936,
        "vT2": -0.06726386239747488
    }
}, {
    "person": {
        "gov_id": "P248",
        "id": 18,
        "name": "Bojan Dobovšek",
        "party": {
            "acronym": "PS NP",
            "id": 97,
            "name": "PS nepovezanih poslancev"
        }
    },
    "score": {
        "vT1": 0.03078937644021219,
        "vT2": -0.097224876946132036
    }
}, {
    "person": {
        "gov_id": "P249",
        "id": 19,
        "name": "Marjan Dolinšek",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.045754133871487454,
        "vT2": -0.12630218165842705
    }
}, {
    "person": {
        "gov_id": "P250",
        "id": 21,
        "name": "Marko Ferluga",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.071339173081778132,
        "vT2": -0.13648343588397843
    }
}, {
    "person": {
        "gov_id": "P251",
        "id": 22,
        "name": "Tomaž Gantar",
        "party": {
            "acronym": "DeSUS",
            "id": 3,
            "name": "PS Demokratska Stranka Upokojencev Slovenije"
        }
    },
    "score": {
        "vT1": -0.038787930729015631,
        "vT2": -0.12686247774459838
    }
}, {
    "person": {
        "gov_id": "P252",
        "id": 23,
        "name": "Jelka Godec",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.18217739671346433,
        "vT2": -0.062786314124573916
    }
}, {
    "person": {
        "gov_id": "P117",
        "id": 24,
        "name": "László Göncz",
        "party": {
            "acronym": "IMNS",
            "id": 2,
            "name": "PS italijanske in madžarske narodne skupnosti"
        }
    },
    "score": {
        "vT1": 0.042144009714548576,
        "vT2": -0.082567558528098023
    }
}, {
    "person": {
        "gov_id": "P116",
        "id": 25,
        "name": "Vinko Gorenak",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.16884420872185135,
        "vT2": -0.071122012090331768
    }
}, {
    "person": {
        "gov_id": "P016",
        "id": 26,
        "name": "Branko Grims",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.17697812109115935,
        "vT2": -0.066482948855662943
    }
}, {
    "person": {
        "gov_id": "P253",
        "id": 27,
        "name": "Irena Grošelj Košnik",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.032277983832179342,
        "vT2": -0.12254827703201249
    }
}, {
    "person": {
        "gov_id": "P255",
        "id": 29,
        "name": "Primož Hainz",
        "party": {
            "acronym": "DeSUS",
            "id": 3,
            "name": "PS Demokratska Stranka Upokojencev Slovenije"
        }
    },
    "score": {
        "vT1": -0.040345238946861477,
        "vT2": -0.12580899743909438
    }
}, {
    "person": {
        "gov_id": "P018",
        "id": 30,
        "name": "Matjaž Han",
        "party": {
            "acronym": "SD",
            "id": 7,
            "name": "PS Socialni Demokrati"
        }
    },
    "score": {
        "vT1": -0.069742536409993741,
        "vT2": -0.13153379582762345
    }
}, {
    "person": {
        "gov_id": "P256",
        "id": 31,
        "name": "Matjaž Hanžek",
        "party": {
            "acronym": "ZL",
            "id": 8,
            "name": "PS Združena Levica"
        }
    },
    "score": {
        "vT1": 0.084154375592254832,
        "vT2": -0.057940918064780779
    }
}, {
    "person": {
        "gov_id": "P020",
        "id": 32,
        "name": "Jožef Horvat",
        "party": {
            "acronym": "NSI",
            "id": 6,
            "name": "PS Nova Slovenija"
        }
    },
    "score": {
        "vT1": 0.13658412131773168,
        "vT2": -0.074456431228851594
    }
}, {
    "person": {
        "gov_id": "P257",
        "id": 33,
        "name": "Mitja Horvat",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.05144973151992633,
        "vT2": -0.13094941079741332
    }
}, {
    "person": {
        "gov_id": "P176",
        "id": 34,
        "name": "Ivan Hršak",
        "party": {
            "acronym": "DeSUS",
            "id": 3,
            "name": "PS Demokratska Stranka Upokojencev Slovenije"
        }
    },
    "score": {
        "vT1": -0.051133989372795528,
        "vT2": -0.12471160297207236
    }
}, {
    "person": {
        "gov_id": "P023",
        "id": 35,
        "name": "Eva Irgl",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.18928525161263313,
        "vT2": -0.07290242130680899
    }
}, {
    "person": {
        "gov_id": "P025",
        "id": 36,
        "name": "Janez Janša",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.16367319581752018,
        "vT2": -0.052154878860892068
    }
}, {
    "person": {
        "gov_id": "P122",
        "id": 37,
        "name": "Franc Jurša",
        "party": {
            "acronym": "DeSUS",
            "id": 3,
            "name": "PS Demokratska Stranka Upokojencev Slovenije"
        }
    },
    "score": {
        "vT1": -0.05777257087265629,
        "vT2": -0.12493700151195308
    }
}, {
    "person": {
        "gov_id": "P259",
        "id": 39,
        "name": "Aleksander Kavčič",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.05263298012096608,
        "vT2": -0.12511540165613982
    }
}, {
    "person": {
        "gov_id": "P260",
        "id": 40,
        "name": "Anita Koleša",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.074519294723387808,
        "vT2": -0.13694039402630906
    }
}, {
    "person": {
        "gov_id": "P261",
        "id": 41,
        "name": "Benedikt Kopmajer",
        "party": {
            "acronym": "DeSUS",
            "id": 3,
            "name": "PS Demokratska Stranka Upokojencev Slovenije"
        }
    },
    "score": {
        "vT1": -0.053950314318786143,
        "vT2": -0.12849458531185584
    }
}, {
    "person": {
        "gov_id": "P262",
        "id": 42,
        "name": "Miha Kordiš",
        "party": {
            "acronym": "ZL",
            "id": 8,
            "name": "PS Združena Levica"
        }
    },
    "score": {
        "vT1": 0.064509052387799193,
        "vT2": -0.069604113017218347
    }
}, {
    "person": {
        "gov_id": "P263",
        "id": 43,
        "name": "Ksenija Korenjak Kramar",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.029033608798370501,
        "vT2": -0.12241254421045226
    }
}, {
    "person": {
        "gov_id": "P264",
        "id": 44,
        "name": "Irena Kotnik",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.056543151789270336,
        "vT2": -0.13166269860367852
    }
}, {
    "person": {
        "gov_id": "P186",
        "id": 45,
        "name": "Marjana Kotnik Poropat",
        "party": {
            "acronym": "DeSUS",
            "id": 3,
            "name": "PS Demokratska Stranka Upokojencev Slovenije"
        }
    },
    "score": {
        "vT1": -0.059140858335693887,
        "vT2": -0.13039762000634042
    }
}, {
    "person": {
        "gov_id": "P265",
        "id": 46,
        "name": "Lilijana Kozlovič",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.074124272760093243,
        "vT2": -0.1360956513488738
    }
}, {
    "person": {
        "gov_id": "P040",
        "id": 47,
        "name": "Danijel Krivec",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.17458399445200851,
        "vT2": -0.068993784851469259
    }
}, {
    "person": {
        "gov_id": "P266",
        "id": 48,
        "name": "Simona Kustec Lipicer",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.066328626713156091,
        "vT2": -0.13487614440157047
    }
}, {
    "person": {
        "gov_id": "P129",
        "id": 49,
        "name": "Zvonko Lah",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.19091295647674572,
        "vT2": -0.072737998563182513
    }
}, {
    "person": {
        "gov_id": "P267",
        "id": 50,
        "name": "Franc Laj",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.015520983630687211,
        "vT2": -0.11653270953383955
    }
}, {
    "person": {
        "gov_id": "P268",
        "id": 51,
        "name": "Suzana Lep Šimenko",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.19376580793886963,
        "vT2": -0.073535456415170022
    }
}, {
    "person": {
        "gov_id": "P269",
        "id": 52,
        "name": "Marinka Levičar",
        "party": {
            "acronym": "DeSUS",
            "id": 3,
            "name": "PS Demokratska Stranka Upokojencev Slovenije"
        }
    },
    "score": {
        "vT1": -0.044352649500608077,
        "vT2": -0.12230803236382475
    }
}, {
    "person": {
        "gov_id": "P187",
        "id": 53,
        "name": "Tomaž Lisec",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.17380436524208456,
        "vT2": -0.061160860622195945
    }
}, {
    "person": {
        "gov_id": "P238",
        "id": 54,
        "name": "Anže Logar",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.18812127176095864,
        "vT2": -0.069159305625155806
    }
}, {
    "person": {
        "gov_id": "P270",
        "id": 55,
        "name": "Žan Mahnič",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.17705329981717416,
        "vT2": -0.070638572093755944
    }
}, {
    "person": {
        "gov_id": "P272",
        "id": 57,
        "name": "Dragan Matić",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.05802364455454579,
        "vT2": -0.12795722982021129
    }
}, {
    "person": {
        "gov_id": "P273",
        "id": 58,
        "name": "Luka Mesec",
        "party": {
            "acronym": "ZL",
            "id": 8,
            "name": "PS Združena Levica"
        }
    },
    "score": {
        "vT1": 0.068542101631545005,
        "vT2": -0.070400169835965268
    }
}, {
    "person": {
        "gov_id": "P191",
        "id": 59,
        "name": "Jani Möderndorfer",
        "party": {
            "acronym": "NeP",
            "id": 100,
            "name": "Nepovezani poslanec"
        }
    },
    "score": {
        "vT1": 0.028009861304806993,
        "vT2": -0.092465370840187522
    }
}, {
    "person": {
        "gov_id": "P274",
        "id": 60,
        "name": "Jasna Murgel",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.059002124339457632,
        "vT2": -0.12782247899843291
    }
}, {
    "person": {
        "gov_id": "P275",
        "id": 61,
        "name": "Bojana Muršič",
        "party": {
            "acronym": "SD",
            "id": 7,
            "name": "PS Socialni Demokrati"
        }
    },
    "score": {
        "vT1": -0.055475483679014156,
        "vT2": -0.12814543979143539
    }
}, {
    "person": {
        "gov_id": "P276",
        "id": 62,
        "name": "Matjaž Nemec",
        "party": {
            "acronym": "SD",
            "id": 7,
            "name": "PS Socialni Demokrati"
        }
    },
    "score": {
        "vT1": -0.045832162956642802,
        "vT2": -0.12469028800018693
    }
}, {
    "person": {
        "gov_id": "P193",
        "id": 63,
        "name": "Ljudmila Novak",
        "party": {
            "acronym": "NSI",
            "id": 6,
            "name": "PS Nova Slovenija"
        }
    },
    "score": {
        "vT1": 0.12830402833914115,
        "vT2": -0.07145324546320353
    }
}, {
    "person": {
        "gov_id": "P277",
        "id": 64,
        "name": "Bojan Podkrajšek",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.19044098656732214,
        "vT2": -0.074700882316438372
    }
}, {
    "person": {
        "gov_id": "P196",
        "id": 65,
        "name": "Marko Pogačnik",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.18406441578400856,
        "vT2": -0.071737430333489421
    }
}, {
    "person": {
        "gov_id": "P098",
        "id": 66,
        "name": "Marijan Pojbič",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.17805030670462607,
        "vT2": -0.06369925594355072
    }
}, {
    "person": {
        "gov_id": "P278",
        "id": 67,
        "name": "Andreja Potočnik",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.071283767904013584,
        "vT2": -0.13436451986785392
    }
}, {
    "person": {
        "gov_id": "P279",
        "id": 68,
        "name": "Ivan Prelog",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.074186609158521488,
        "vT2": -0.13816012642455436
    }
}, {
    "person": {
        "gov_id": "P280",
        "id": 69,
        "name": "Uroš Prikl",
        "party": {
            "acronym": "DeSUS",
            "id": 3,
            "name": "PS Demokratska Stranka Upokojencev Slovenije"
        }
    },
    "score": {
        "vT1": -0.064253874726256988,
        "vT2": -0.1332522939656221
    }
}, {
    "person": {
        "gov_id": "P281",
        "id": 70,
        "name": "Branislav Rajić",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.063177195416941834,
        "vT2": -0.13117050201821023
    }
}, {
    "person": {
        "gov_id": "P282",
        "id": 71,
        "name": "Danilo Anton Ranc",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.079048554631362261,
        "vT2": -0.13994260399644978
    }
}, {
    "person": {
        "gov_id": "P283",
        "id": 72,
        "name": "Kamal Izidor Shaker",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.074473884082810485,
        "vT2": -0.13541618352196846
    }
}, {
    "person": {
        "gov_id": "P284",
        "id": 73,
        "name": "Janja Sluga",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.059014745825270477,
        "vT2": -0.13100466971769373
    }
}, {
    "person": {
        "gov_id": "P285",
        "id": 74,
        "name": "Vojka Šergan",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.075108506735214645,
        "vT2": -0.1389478506349042
    }
}, {
    "person": {
        "gov_id": "P201",
        "id": 75,
        "name": "Andrej Šircelj",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.18393730250056894,
        "vT2": -0.070546827687515842
    }
}, {
    "person": {
        "gov_id": "P286",
        "id": 76,
        "name": "Ivan Škodnik",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.076579468607238327,
        "vT2": -0.13940106424781704
    }
}, {
    "person": {
        "gov_id": "P287",
        "id": 77,
        "name": "Maruša Škopac",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.067446491329740205,
        "vT2": -0.13429129177136795
    }
}, {
    "person": {
        "gov_id": "P077",
        "id": 78,
        "name": "Jože Tanko",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.1811921163178207,
        "vT2": -0.075052231523294266
    }
}, {
    "person": {
        "gov_id": "P288",
        "id": 79,
        "name": "Matej Tašner Vatovec",
        "party": {
            "acronym": "ZL",
            "id": 8,
            "name": "PS Združena Levica"
        }
    },
    "score": {
        "vT1": 0.061404489883035353,
        "vT2": -0.071389598503431531
    }
}, {
    "person": {
        "gov_id": "P289",
        "id": 80,
        "name": "Violeta Tomić",
        "party": {
            "acronym": "ZL",
            "id": 8,
            "name": "PS Združena Levica"
        }
    },
    "score": {
        "vT1": 0.064307472250087636,
        "vT2": -0.070280765785946386
    }
}, {
    "person": {
        "gov_id": "P204",
        "id": 81,
        "name": "Matej Tonin",
        "party": {
            "acronym": "NSI",
            "id": 6,
            "name": "PS Nova Slovenija"
        }
    },
    "score": {
        "vT1": 0.1451953523198474,
        "vT2": -0.064730612335816215
    }
}, {
    "person": {
        "gov_id": "P290",
        "id": 82,
        "name": "Franc Trček ",
        "party": {
            "acronym": "ZL",
            "id": 8,
            "name": "PS Združena Levica"
        }
    },
    "score": {
        "vT1": 0.084764435896496571,
        "vT2": -0.062194513333159361
    }
}, {
    "person": {
        "gov_id": "P081",
        "id": 83,
        "name": "Janko Veber",
        "party": {
            "acronym": "SD",
            "id": 7,
            "name": "PS Socialni Demokrati"
        }
    },
    "score": {
        "vT1": -0.016296914378576013,
        "vT2": -0.082916613556974925
    }
}, {
    "person": {
        "gov_id": "P291",
        "id": 84,
        "name": "Vesna Vervega",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.052193001798957937,
        "vT2": -0.12801506557485098
    }
}, {
    "person": {
        "gov_id": "P207",
        "id": 85,
        "name": "Peter Vilfan",
        "party": {
            "acronym": "DeSUS",
            "id": 3,
            "name": "PS Demokratska Stranka Upokojencev Slovenije"
        }
    },
    "score": {
        "vT1": 0.015491515158488281,
        "vT2": -0.10639490813457647
    }
}, {
    "person": {
        "gov_id": "P292",
        "id": 86,
        "name": "Jernej Vrtovec",
        "party": {
            "acronym": "NSI",
            "id": 6,
            "name": "PS Nova Slovenija"
        }
    },
    "score": {
        "vT1": 0.12754079856052403,
        "vT2": -0.07415291559711705
    }
}, {
    "person": {
        "gov_id": "P293",
        "id": 87,
        "name": "Simon Zajc",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.076200652921232612,
        "vT2": -0.13960830265591051
    }
}, {
    "person": {
        "gov_id": "P294",
        "id": 88,
        "name": "Igor Zorčič",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.064980018494418909,
        "vT2": -0.13557154940860913
    }
}, {
    "person": {
        "gov_id": "P295",
        "id": 89,
        "name": "Branko Zorman",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.064048800537175002,
        "vT2": -0.13214475763037126
    }
}, {
    "person": {
        "gov_id": "P212",
        "id": 91,
        "name": "Ljubo Žnidar",
        "party": {
            "acronym": "SDS",
            "id": 5,
            "name": "PS Slovenska Demokratska Stranka"
        }
    },
    "score": {
        "vT1": 0.18473053288443475,
        "vT2": -0.070277868550136055
    }
}, {
    "person": {
        "gov_id": "P296",
        "id": 92,
        "name": "Dušan Verbič",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.067363908330334871,
        "vT2": -0.12843491870663892
    }
}, {
    "person": {
        "gov_id": "P298",
        "id": 95,
        "name": "Marija Bačič",
        "party": {
            "acronym": "SD",
            "id": 7,
            "name": "PS Socialni Demokrati"
        }
    },
    "score": {
        "vT1": -0.046056543771623527,
        "vT2": -0.1196700935678805
    }
}, {
    "person": {
        "gov_id": "P297",
        "id": 96,
        "name": "Marija Antonija Kovačič",
        "party": {
            "acronym": "DeSUS",
            "id": 3,
            "name": "PS Demokratska Stranka Upokojencev Slovenije"
        }
    },
    "score": {
        "vT1": -0.065485963172269374,
        "vT2": -0.12439237528612471
    }
}, {
    "person": {
        "gov_id": "P299",
        "id": 1354,
        "name": "Bojan Krajnc",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.053836121506135363,
        "vT2": -0.098019118972574037
    }
}, {
    "person": {
        "gov_id": "P302",
        "id": 1355,
        "name": "Saša Tabaković",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.035632425324470494,
        "vT2": -0.069693404967863179
    }
}, {
    "person": {
        "gov_id": "P301",
        "id": 1356,
        "name": "Jan Škoberne",
        "party": {
            "acronym": "SD",
            "id": 7,
            "name": "PS Socialni Demokrati"
        }
    },
    "score": {
        "vT1": -0.0037204134645520406,
        "vT2": -0.059696103438433783
    }
}, {
    "person": {
        "gov_id": "P300",
        "id": 1357,
        "name": "Dušan Radič",
        "party": {
            "acronym": "SMC",
            "id": 1,
            "name": "PS Stranka modernega centra"
        }
    },
    "score": {
        "vT1": -0.050207396290445017,
        "vT2": -0.091055640053686063
    }
}]

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

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "ideology1";
var yCat = "ideology2";

data.forEach(function(d) {
    d.ideology1 = +d.score.vT1;
    d.ideology2 = +d.score.vT2;
});

var xMax = d3.max(data, function(d) {
        return d[xCat];
    }) * 1.05,
    xMin = d3.min(data, function(d) {
        return d[xCat];
    }),
    xMin = xMin > 0 ? 0 : xMin,
    yMax = d3.max(data, function(d) {
        return d[yCat];
    }) * 1.05,
    yMin = d3.min(data, function(d) {
        return d[yCat];
    }),
    yMin = yMin > 0 ? 0 : yMin;

x.domain([xMin, xMax]);
y.domain([yMin, yMax]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0);

var parties = [];
for (group in groupedData) {
    parties.push(groupedData[group][0].person.party.acronym.replace(' ', '_'));
}

var color = d3.scale.ordinal()
    .range(["#8FCFEE", "#4FB5E6", "#AA7375", "#534961", "#4F6379", "#5388AA", "#D9776B", "#BA594C"]);

var zoomBeh = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([0, 500])
    .on("zoom", zoom);

var svg = d3.select("#scatter")
    .append("svg")
    .attr('viewBox', '0 0 700 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append("g")
    .call(zoomBeh);

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

svg.append("g")
    .classed("y axis", true)
    .call(yAxis)

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

var defs = svg.append('defs');

for (i in data) {
    defs.append("pattern")
        .attr("id", data[i].person.gov_id)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 40)
        .attr("height", 40)
        .attr("x", -20)
        .attr("y", 20)
        .append("image")
        .attr("xlink:href", 'https://cdn.parlameter.si/v1/img/people/' + data[i].person.gov_id + '.png')
        .attr("width", 40)
        .attr("height", 40)
        .attr("x", 0)
        .attr("y", 0);
}

for (group in groupedData) {

    var currentselection = d3.select('#kompasgroup' + groupedData[group][0].person.party.acronym.replace(' ', '_'))
        .selectAll('.dot')
        .data(groupedData[group])
        .enter()
        .append("circle")
        .classed("dot", true)
        .attr('id', function(d) {
            return '_' + d.person.id;
        })
        .attr("r", function(d) {
            return 20;
        })
        .attr("transform", transform)
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
    // .style('filter', 'url(#glow)');
    // .on('mouseover', overGroup)
    // .off('mouseover', offGroup);

    drawHull(currentselection, groupedData[group]);

}

function zoom() {

    svg.selectAll(".dot")
        .attr("transform", transform);

    svg.selectAll(".singlehull")
        .attr("d", function(d) {
            var parent = d3.select('#' + d3.select(this).attr('data-parent'));
            var translateX = parseInt(parent.attr('transform').split('(')[1].split(',')[0]);
            var translateY = parseInt(parent.attr('transform').split('(')[1].split(',')[1].split(')')[0]);
            console.log(translateX, translateY)
            return "M" + translateX + ',' + translateY + "L" + (translateX + 0.01) + ',' + translateY + "Z";
        });

    for (group in groupedData) {

        var currentselection = d3.select('#kompasgroup' + groupedData[group][0].person.party.acronym.replace(' ', '_'))

        redrawHull(currentselection, groupedData[group]);

    }
}

function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
}

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
