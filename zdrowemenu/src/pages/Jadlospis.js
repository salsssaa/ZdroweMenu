import React, { useState, useEffect } from 'react';

// Stałe jadłospisy na 2 tygodnie dla różnych diet
const JADLOSPISY_TYGODNIOWE = {
  "standardowa": {
    "tydzien1": {
      "2024-03-18": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Owsianka z owocami", "ilosc": 250, "jednostka": "g", "kalorie": 350},
            {"nazwa": "Jogurt naturalny", "ilosc": 150, "jednostka": "g", "kalorie": 100},
            {"nazwa": "Herbata zielona", "ilosc": 250, "jednostka": "ml", "kalorie": 0}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa krem z brokułów", "ilosc": 300, "jednostka": "ml", "kalorie": 200},
            {"nazwa": "Pierś z kurczaka", "ilosc": 150, "jednostka": "g", "kalorie": 250},
            {"nazwa": "Kasza gryczana", "ilosc": 100, "jednostka": "g", "kalorie": 150},
            {"nazwa": "Surówka z marchewki", "ilosc": 100, "jednostka": "g", "kalorie": 50}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Kanapki z pastą jajeczną", "ilosc": 2, "jednostka": "szt", "kalorie": 300},
            {"nazwa": "Sok pomidorowy", "ilosc": 200, "jednostka": "ml", "kalorie": 50}
          ]
        }
      },
      "2024-03-19": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Tosty z awokado", "ilosc": 2, "jednostka": "szt", "kalorie": 400},
            {"nazwa": "Kawa z mlekiem", "ilosc": 250, "jednostka": "ml", "kalorie": 50}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa pomidorowa", "ilosc": 300, "jednostka": "ml", "kalorie": 150},
            {"nazwa": "Łosoś pieczony", "ilosc": 150, "jednostka": "g", "kalorie": 300},
            {"nazwa": "Ryż brązowy", "ilosc": 100, "jednostka": "g", "kalorie": 130},
            {"nazwa": "Brokuły gotowane", "ilosc": 150, "jednostka": "g", "kalorie": 50}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Sałatka grecka", "ilosc": 300, "jednostka": "g", "kalorie": 350},
            {"nazwa": "Chleb pełnoziarnisty", "ilosc": 2, "jednostka": "kromki", "kalorie": 160}
          ]
        }
      }
    },
    "tydzien2": {
      "2024-03-25": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Jajecznica z warzywami", "ilosc": 250, "jednostka": "g", "kalorie": 320},
            {"nazwa": "Chleb pełnoziarnisty", "ilosc": 2, "jednostka": "kromki", "kalorie": 160},
            {"nazwa": "Kawa z mlekiem", "ilosc": 250, "jednostka": "ml", "kalorie": 50}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa krem z dyni", "ilosc": 300, "jednostka": "ml", "kalorie": 180},
            {"nazwa": "Wołowina pieczona", "ilosc": 150, "jednostka": "g", "kalorie": 280},
            {"nazwa": "Kasza jaglana", "ilosc": 100, "jednostka": "g", "kalorie": 120},
            {"nazwa": "Surówka z kapusty", "ilosc": 150, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Tosty z pastą z tuńczyka", "ilosc": 2, "jednostka": "szt", "kalorie": 280},
            {"nazwa": "Herbata owocowa", "ilosc": 250, "jednostka": "ml", "kalorie": 0}
          ]
        }
      },
      "2024-03-26": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Płatki owsiane z mlekiem", "ilosc": 250, "jednostka": "g", "kalorie": 300},
            {"nazwa": "Banany", "ilosc": 2, "jednostka": "szt", "kalorie": 180}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa jarzynowa", "ilosc": 300, "jednostka": "ml", "kalorie": 150},
            {"nazwa": "Kurczak w sosie curry", "ilosc": 150, "jednostka": "g", "kalorie": 250},
            {"nazwa": "Ryż basmati", "ilosc": 100, "jednostka": "g", "kalorie": 130},
            {"nazwa": "Warzywa na parze", "ilosc": 200, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Omlet z warzywami", "ilosc": 200, "jednostka": "g", "kalorie": 280},
            {"nazwa": "Sok warzywny", "ilosc": 200, "jednostka": "ml", "kalorie": 80}
          ]
        }
      }
    }
  },
  "wegetarianska": {
    "tydzien1": {
      "2024-03-18": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Tofu scramble", "ilosc": 200, "jednostka": "g", "kalorie": 250},
            {"nazwa": "Chleb pełnoziarnisty", "ilosc": 2, "jednostka": "kromki", "kalorie": 160},
            {"nazwa": "Sok pomarańczowy", "ilosc": 250, "jednostka": "ml", "kalorie": 120}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa krem z dyni", "ilosc": 300, "jednostka": "ml", "kalorie": 180},
            {"nazwa": "Falafel", "ilosc": 150, "jednostka": "g", "kalorie": 280},
            {"nazwa": "Hummus", "ilosc": 100, "jednostka": "g", "kalorie": 160},
            {"nazwa": "Sałatka z warzyw", "ilosc": 200, "jednostka": "g", "kalorie": 100}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Quinoa z warzywami", "ilosc": 250, "jednostka": "g", "kalorie": 320},
            {"nazwa": "Jogurt sojowy", "ilosc": 150, "jednostka": "g", "kalorie": 90}
          ]
        }
      },
      "2024-03-19": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Owsianka z orzechami", "ilosc": 250, "jednostka": "g", "kalorie": 380},
            {"nazwa": "Mleko migdałowe", "ilosc": 250, "jednostka": "ml", "kalorie": 60}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa soczewicowa", "ilosc": 300, "jednostka": "ml", "kalorie": 220},
            {"nazwa": "Kotlety z ciecierzycy", "ilosc": 150, "jednostka": "g", "kalorie": 250},
            {"nazwa": "Kasza jaglana", "ilosc": 100, "jednostka": "g", "kalorie": 120},
            {"nazwa": "Surówka z kapusty", "ilosc": 150, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Tosty z pastą warzywną", "ilosc": 2, "jednostka": "szt", "kalorie": 280},
            {"nazwa": "Herbata owocowa", "ilosc": 250, "jednostka": "ml", "kalorie": 0}
          ]
        }
      }
    },
    "tydzien2": {
      "2024-03-25": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Koktajl owocowy", "ilosc": 300, "jednostka": "ml", "kalorie": 250},
            {"nazwa": "Płatki owsiane", "ilosc": 50, "jednostka": "g", "kalorie": 180}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa warzywna", "ilosc": 300, "jednostka": "ml", "kalorie": 150},
            {"nazwa": "Tofu w sosie curry", "ilosc": 150, "jednostka": "g", "kalorie": 220},
            {"nazwa": "Ryż brązowy", "ilosc": 100, "jednostka": "g", "kalorie": 130},
            {"nazwa": "Warzywa na parze", "ilosc": 200, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Sałatka z awokado", "ilosc": 300, "jednostka": "g", "kalorie": 320},
            {"nazwa": "Chleb pełnoziarnisty", "ilosc": 2, "jednostka": "kromki", "kalorie": 160}
          ]
        }
      },
      "2024-03-26": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Jajecznica z warzywami", "ilosc": 200, "jednostka": "g", "kalorie": 280},
            {"nazwa": "Chleb pełnoziarnisty", "ilosc": 2, "jednostka": "kromki", "kalorie": 160}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa krem z brokułów", "ilosc": 300, "jednostka": "ml", "kalorie": 180},
            {"nazwa": "Kotlety z soczewicy", "ilosc": 150, "jednostka": "g", "kalorie": 250},
            {"nazwa": "Kasza gryczana", "ilosc": 100, "jednostka": "g", "kalorie": 120},
            {"nazwa": "Surówka z marchewki", "ilosc": 150, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Tosty z pastą z tuńczyka", "ilosc": 2, "jednostka": "szt", "kalorie": 280},
            {"nazwa": "Herbata owocowa", "ilosc": 250, "jednostka": "ml", "kalorie": 0}
          ]
        }
      }
    }
  },
  "bezglutenowa": {
    "tydzien1": {
      "2024-03-18": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Jajecznica z warzywami", "ilosc": 200, "jednostka": "g", "kalorie": 280},
            {"nazwa": "Chleb bezglutenowy", "ilosc": 2, "jednostka": "kromki", "kalorie": 140},
            {"nazwa": "Kawa z mlekiem", "ilosc": 250, "jednostka": "ml", "kalorie": 50}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa krem z cukinii", "ilosc": 300, "jednostka": "ml", "kalorie": 180},
            {"nazwa": "Indyk pieczony", "ilosc": 150, "jednostka": "g", "kalorie": 220},
            {"nazwa": "Ryż basmati", "ilosc": 100, "jednostka": "g", "kalorie": 130},
            {"nazwa": "Warzywa na parze", "ilosc": 200, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Sałatka z tuńczykiem", "ilosc": 300, "jednostka": "g", "kalorie": 320},
            {"nazwa": "Chleb bezglutenowy", "ilosc": 2, "jednostka": "kromki", "kalorie": 140}
          ]
        }
      },
      "2024-03-19": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Koktajl owocowy", "ilosc": 300, "jednostka": "ml", "kalorie": 250},
            {"nazwa": "Płatki bezglutenowe", "ilosc": 50, "jednostka": "g", "kalorie": 180}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa jarzynowa", "ilosc": 300, "jednostka": "ml", "kalorie": 150},
            {"nazwa": "Dorsz pieczony", "ilosc": 150, "jednostka": "g", "kalorie": 180},
            {"nazwa": "Kasza jaglana", "ilosc": 100, "jednostka": "g", "kalorie": 120},
            {"nazwa": "Surówka z selera", "ilosc": 150, "jednostka": "g", "kalorie": 60}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Omlet z warzywami", "ilosc": 200, "jednostka": "g", "kalorie": 280},
            {"nazwa": "Sok warzywny", "ilosc": 200, "jednostka": "ml", "kalorie": 80}
          ]
        }
      }
    },
    "tydzien2": {
      "2024-03-25": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Tosty bezglutenowe z awokado", "ilosc": 2, "jednostka": "szt", "kalorie": 320},
            {"nazwa": "Kawa z mlekiem", "ilosc": 250, "jednostka": "ml", "kalorie": 50}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa krem z brokułów", "ilosc": 300, "jednostka": "ml", "kalorie": 180},
            {"nazwa": "Kurczak pieczony", "ilosc": 150, "jednostka": "g", "kalorie": 220},
            {"nazwa": "Ryż basmati", "ilosc": 100, "jednostka": "g", "kalorie": 130},
            {"nazwa": "Warzywa na parze", "ilosc": 200, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Sałatka z łososiem", "ilosc": 300, "jednostka": "g", "kalorie": 320},
            {"nazwa": "Chleb bezglutenowy", "ilosc": 2, "jednostka": "kromki", "kalorie": 140}
          ]
        }
      },
      "2024-03-26": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Jajecznica z warzywami", "ilosc": 200, "jednostka": "g", "kalorie": 280},
            {"nazwa": "Chleb bezglutenowy", "ilosc": 2, "jednostka": "kromki", "kalorie": 140}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa jarzynowa", "ilosc": 300, "jednostka": "ml", "kalorie": 150},
            {"nazwa": "Indyk pieczony", "ilosc": 150, "jednostka": "g", "kalorie": 220},
            {"nazwa": "Kasza jaglana", "ilosc": 100, "jednostka": "g", "kalorie": 120},
            {"nazwa": "Surówka z kapusty", "ilosc": 150, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Tosty z pastą z tuńczyka", "ilosc": 2, "jednostka": "szt", "kalorie": 280},
            {"nazwa": "Herbata owocowa", "ilosc": 250, "jednostka": "ml", "kalorie": 0}
          ]
        }
      }
    }
  },
  "wysokobialkowa": {
    "tydzien1": {
      "2024-03-18": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Omlet z 4 jaj", "ilosc": 200, "jednostka": "g", "kalorie": 400},
            {"nazwa": "Płatki owsiane z białkiem", "ilosc": 50, "jednostka": "g", "kalorie": 200},
            {"nazwa": "Koktajl proteinowy", "ilosc": 300, "jednostka": "ml", "kalorie": 250}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa krem z soczewicy", "ilosc": 300, "jednostka": "ml", "kalorie": 250},
            {"nazwa": "Pierś z kurczaka", "ilosc": 200, "jednostka": "g", "kalorie": 330},
            {"nazwa": "Ryż brązowy", "ilosc": 100, "jednostka": "g", "kalorie": 130},
            {"nazwa": "Brokuły gotowane", "ilosc": 200, "jednostka": "g", "kalorie": 70}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Twaróg z warzywami", "ilosc": 200, "jednostka": "g", "kalorie": 280},
            {"nazwa": "Chleb pełnoziarnisty", "ilosc": 2, "jednostka": "kromki", "kalorie": 160}
          ]
        }
      },
      "2024-03-19": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Jajecznica z 4 jaj", "ilosc": 250, "jednostka": "g", "kalorie": 450},
            {"nazwa": "Tosty z pastą z tuńczyka", "ilosc": 2, "jednostka": "szt", "kalorie": 300}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa z soczewicy", "ilosc": 300, "jednostka": "ml", "kalorie": 220},
            {"nazwa": "Łosoś pieczony", "ilosc": 200, "jednostka": "g", "kalorie": 400},
            {"nazwa": "Kasza gryczana", "ilosc": 100, "jednostka": "g", "kalorie": 150},
            {"nazwa": "Surówka z kapusty", "ilosc": 150, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Sałatka z tuńczykiem", "ilosc": 300, "jednostka": "g", "kalorie": 350},
            {"nazwa": "Jogurt proteinowy", "ilosc": 200, "jednostka": "g", "kalorie": 180}
          ]
        }
      }
    },
    "tydzien2": {
      "2024-03-25": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Owsianka z białkiem", "ilosc": 250, "jednostka": "g", "kalorie": 380},
            {"nazwa": "Jajka na twardo", "ilosc": 3, "jednostka": "szt", "kalorie": 240}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa krem z brokułów", "ilosc": 300, "jednostka": "ml", "kalorie": 200},
            {"nazwa": "Wołowina pieczona", "ilosc": 200, "jednostka": "g", "kalorie": 380},
            {"nazwa": "Ryż basmati", "ilosc": 100, "jednostka": "g", "kalorie": 130},
            {"nazwa": "Warzywa na parze", "ilosc": 200, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Koktajl proteinowy", "ilosc": 300, "jednostka": "ml", "kalorie": 250},
            {"nazwa": "Twaróg z owocami", "ilosc": 200, "jednostka": "g", "kalorie": 280}
          ]
        }
      },
      "2024-03-26": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Omlet z warzywami", "ilosc": 250, "jednostka": "g", "kalorie": 400},
            {"nazwa": "Chleb pełnoziarnisty", "ilosc": 2, "jednostka": "kromki", "kalorie": 160}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa jarzynowa", "ilosc": 300, "jednostka": "ml", "kalorie": 150},
            {"nazwa": "Indyk pieczony", "ilosc": 200, "jednostka": "g", "kalorie": 300},
            {"nazwa": "Kasza jaglana", "ilosc": 100, "jednostka": "g", "kalorie": 120},
            {"nazwa": "Surówka z marchewki", "ilosc": 150, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Sałatka z łososiem", "ilosc": 300, "jednostka": "g", "kalorie": 320},
            {"nazwa": "Jogurt proteinowy", "ilosc": 200, "jednostka": "g", "kalorie": 180}
          ]
        }
      }
    }
  },
  "niskokaloryczna": {
    "tydzien1": {
      "2024-03-18": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Owsianka z owocami", "ilosc": 200, "jednostka": "g", "kalorie": 250},
            {"nazwa": "Jogurt naturalny 0%", "ilosc": 150, "jednostka": "g", "kalorie": 60},
            {"nazwa": "Herbata zielona", "ilosc": 250, "jednostka": "ml", "kalorie": 0}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa krem z warzyw", "ilosc": 300, "jednostka": "ml", "kalorie": 150},
            {"nazwa": "Pierś z kurczaka", "ilosc": 100, "jednostka": "g", "kalorie": 165},
            {"nazwa": "Kasza gryczana", "ilosc": 50, "jednostka": "g", "kalorie": 75},
            {"nazwa": "Surówka z marchewki", "ilosc": 100, "jednostka": "g", "kalorie": 50}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Sałatka warzywna", "ilosc": 300, "jednostka": "g", "kalorie": 150},
            {"nazwa": "Chleb pełnoziarnisty", "ilosc": 1, "jednostka": "kromka", "kalorie": 80}
          ]
        }
      },
      "2024-03-19": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Tosty z awokado", "ilosc": 1, "jednostka": "szt", "kalorie": 200},
            {"nazwa": "Kawa z mlekiem 0%", "ilosc": 250, "jednostka": "ml", "kalorie": 30}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa pomidorowa", "ilosc": 300, "jednostka": "ml", "kalorie": 120},
            {"nazwa": "Dorsz pieczony", "ilosc": 100, "jednostka": "g", "kalorie": 120},
            {"nazwa": "Ryż brązowy", "ilosc": 50, "jednostka": "g", "kalorie": 65},
            {"nazwa": "Brokuły gotowane", "ilosc": 150, "jednostka": "g", "kalorie": 50}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Sałatka grecka", "ilosc": 250, "jednostka": "g", "kalorie": 200},
            {"nazwa": "Chleb pełnoziarnisty", "ilosc": 1, "jednostka": "kromka", "kalorie": 80}
          ]
        }
      }
    },
    "tydzien2": {
      "2024-03-25": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Jajecznica z 2 jaj", "ilosc": 150, "jednostka": "g", "kalorie": 200},
            {"nazwa": "Chleb pełnoziarnisty", "ilosc": 1, "jednostka": "kromka", "kalorie": 80}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa krem z dyni", "ilosc": 300, "jednostka": "ml", "kalorie": 120},
            {"nazwa": "Indyk pieczony", "ilosc": 100, "jednostka": "g", "kalorie": 150},
            {"nazwa": "Kasza jaglana", "ilosc": 50, "jednostka": "g", "kalorie": 60},
            {"nazwa": "Surówka z kapusty", "ilosc": 150, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Tosty z pastą warzywną", "ilosc": 1, "jednostka": "szt", "kalorie": 140},
            {"nazwa": "Herbata owocowa", "ilosc": 250, "jednostka": "ml", "kalorie": 0}
          ]
        }
      },
      "2024-03-26": {
        "sniadanie": {
          "posilki": [
            {"nazwa": "Płatki owsiane z mlekiem 0%", "ilosc": 200, "jednostka": "g", "kalorie": 180},
            {"nazwa": "Jabłko", "ilosc": 1, "jednostka": "szt", "kalorie": 80}
          ]
        },
        "obiad": {
          "posilki": [
            {"nazwa": "Zupa jarzynowa", "ilosc": 300, "jednostka": "ml", "kalorie": 120},
            {"nazwa": "Łosoś pieczony", "ilosc": 100, "jednostka": "g", "kalorie": 200},
            {"nazwa": "Ryż basmati", "ilosc": 50, "jednostka": "g", "kalorie": 65},
            {"nazwa": "Warzywa na parze", "ilosc": 200, "jednostka": "g", "kalorie": 80}
          ]
        },
        "kolacja": {
          "posilki": [
            {"nazwa": "Omlet z warzywami", "ilosc": 150, "jednostka": "g", "kalorie": 180},
            {"nazwa": "Sok warzywny", "ilosc": 200, "jednostka": "ml", "kalorie": 80}
          ]
        }
      }
    }
  }
};

const Jadlospis = () => {
  const [jadlospis, setJadlospis] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState("standardowa");
  const [selectedWeek, setSelectedWeek] = useState("tydzien1");

  useEffect(() => {
    setJadlospis(JADLOSPISY_TYGODNIOWE[selectedDiet][selectedWeek]);
  }, [selectedDiet, selectedWeek]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pl-PL', options);
  };

  const renderDailyJadlospis = (date, jadlospisData) => {
    return (
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-xl font-semibold text-white mb-4">
          {formatDate(date)}
        </h3>
        
        {/* Śniadanie */}
        <div className="border-l-4 border-emerald-500 pl-4 mb-6">
          <h4 className="font-medium text-lg text-white">Śniadanie</h4>
          <div className="mt-2">
            {jadlospisData.sniadanie.posilki.map((item, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-700">
                <span className="text-gray-300">{item.nazwa}</span>
                <span className="text-gray-400">{item.ilosc} {item.jednostka} ({item.kalorie} kcal)</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Obiad */}
        <div className="border-l-4 border-emerald-500 pl-4 mb-6">
          <h4 className="font-medium text-lg text-white">Obiad</h4>
          <div className="mt-2">
            {jadlospisData.obiad.posilki.map((item, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-700">
                <span className="text-gray-300">{item.nazwa}</span>
                <span className="text-gray-400">{item.ilosc} {item.jednostka} ({item.kalorie} kcal)</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Kolacja */}
        <div className="border-l-4 border-emerald-500 pl-4 mb-6">
          <h4 className="font-medium text-lg text-white">Kolacja</h4>
          <div className="mt-2">
            {jadlospisData.kolacja.posilki.map((item, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-700">
                <span className="text-gray-300">{item.nazwa}</span>
                <span className="text-gray-400">{item.ilosc} {item.jednostka} ({item.kalorie} kcal)</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Podsumowanie kalorii */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between">
            <span className="font-medium text-white">Suma kalorii:</span>
            <span className="font-bold text-emerald-400">
              {jadlospisData.sniadanie.posilki.reduce((sum, item) => sum + item.kalorie, 0) +
               jadlospisData.obiad.posilki.reduce((sum, item) => sum + item.kalorie, 0) +
               jadlospisData.kolacja.posilki.reduce((sum, item) => sum + item.kalorie, 0)} kcal
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-400">Jadłospis tygodniowy</h2>
            <div className="flex gap-4">
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="standardowa">Dieta standardowa</option>
                <option value="wegetarianska">Dieta wegetariańska</option>
                <option value="bezglutenowa">Dieta bezglutenowa</option>
                <option value="wysokobialkowa">Dieta wysokobiałkowa</option>
                <option value="niskokaloryczna">Dieta niskokaloryczna</option>
              </select>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="tydzien1">Tydzień 1</option>
                <option value="tydzien2">Tydzień 2</option>
              </select>
            </div>
          </div>
          
          {jadlospis ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(jadlospis).map(([date, dayJadlospis]) => (
                <div key={date}>
                  {renderDailyJadlospis(date, dayJadlospis)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center my-8">Ładowanie jadłospisu...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jadlospis;
