function Game(_Player){
    this._Player = _Player;
    this.CurrentStory;
    this.Selections = [];
    this.CurrentPage;
    this.LevelType;
    this.AllowedActions;

    this.DrawAllBlocs = function(){
        var _this = this;
        document.getElementById("game-grid-container").style.background = "url('images/Backgrounds/10857-v6.jpg') top left";
        document.getElementById("game-grid-container").style.backgroundSize = "100% 80%";
        setTimeout(function(){
            document.getElementById("game-grid").innerHTML = "";
            for(var i = _this.Selections.length - 1 ; i >= 0 ; i--){
                var _Cell = document.createElement("div");
                _Cell.classList.add("cell");
                _Cell.id = "cell-" + _this.Selections[i].Card.FrontId;
                document.getElementById("game-grid").appendChild(_Cell);
                _this.Selections[i].DrawBloc(i);
            }
        }, 800);
    };

    this.MakeVeil = function(){
        var _Veil = document.createElement("div");
        _Veil.classList.add("veil");
        _Veil.id = "veil";
        document.getElementById("game-grid-container").appendChild(_Veil);
    };
    
    this.NextPage = function(){
        this.MakeVeil();
        var _this = this;
        if(this.CurrentPage == this.LevelType.Level.PagesQty){
            this._Player.Chapter++;
            this._Player.XP += this.CurrentPage;
            this._Player.WriteDatas();
            setTimeout(function(){
                _this.Win();
                setTimeout(function(){
                    _this.StartNewGame();
                }, 2500);
                setTimeout(function(){
                    document.getElementById("veil").remove();
                }, 3000);
            }, 2000);
        }
        else{
            var _this = this;
            _this.CurrentPage++;
            this.MakeSelections();
            this.DrawAllBlocs();
            setTimeout(function(){
                for(var i = 0 ; i < _this.Selections.length ; i++){
                    document.getElementById(_this.Selections[i].Card.FrontId).classList.add("bloc-hidden");
                }
                setTimeout(function(){
                    document.getElementById("veil").remove();
                }, 500);
            }, 12000);
        }
    };

    this.DisplayChapter = function(){
        document.getElementById("gbh-chapter").innerHTML = this._Player.Chapter;

        var _titlecontainer = document.createElement("div");
        _titlecontainer.classList.add("title-container", "title-container-displayed");

        var _Chapter = document.createElement("h2");
        _Chapter.innerHTML = "Chapitre " + this._Player.Chapter;

        var _SubtitleContainer = document.createElement("div");
        _SubtitleContainer.classList.add("level-difficulty");

        var _SubtitleLvl = document.createElement("h3");
        _SubtitleLvl.innerHTML = "Niveau " + this.LevelType.Level.Label.toLowerCase();

        _titlecontainer.appendChild(_Chapter);
        _SubtitleContainer.appendChild(_SubtitleLvl);
        _titlecontainer.appendChild(_SubtitleContainer);

        document.body.appendChild(_titlecontainer);
        setTimeout(function(){
            _titlecontainer.remove();
        }, 3000);
    };

    this.CopyList = function(o) {
        var output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            output[key] = (typeof v === "object") ? this.CopyList(v) : v;
        }
        return output;
    };

    this.MakeSelections = function(){
        this.Selections = [];
        var _TempInventory =[];
        var _TempInventory = this.CopyList(CardsLibrary);
        _TempInventory = this.Shuffle(_TempInventory);
        var _TempInventory2 =[];
        var _TempInventory2 = this.CopyList(_TempInventory);
        for(var _cards = 0 ; _cards < 10 ; _cards++){
            var _Bloc = new Card(_TempInventory[_cards]);
            _Bloc.User = this._Player;
            _Bloc.Page = this.CurrentPage;
            _Bloc.Card.FrontId += "-" + this.CurrentPage;
            this.Selections.push(_Bloc);
        }
        for(var _cards = 0 ; _cards < 10 ; _cards++){
            var _Bloc2 = new Card(_TempInventory2[_cards]);
            _Bloc2.User = this._Player;
            _Bloc2.Page = this.CurrentPage;
            _Bloc2.Card.FrontId += "-" + this.CurrentPage + "-2";
            this.Selections.push(_Bloc2);
        }
        this.Selections = this.Shuffle(this.Selections);
    };

    this.Shuffle = function(Deck){
        for (var i = Deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [Deck[i], Deck[j]] = [Deck[j], Deck[i]];
        }
        return Deck;
    };

    this.Loose = function(){
        var _this = this;
        var _TitleContainer = document.createElement("div");
        _TitleContainer.classList.add("title-container", "title-loose", "title-container-displayed");
        var _TitlecontainerInner = document.createElement("h2");
        _TitlecontainerInner.innerHTML = "Vous avez perdu !";
        _TitleContainer.appendChild(_TitlecontainerInner);
        document.body.appendChild(_TitleContainer);
        setTimeout(function(){
            _TitleContainer.remove();
            _this.StartNewGame();
        }, 3000);
    };

    this.Win = function(){
        var _this = this;
        var _TitleContainer = document.createElement("div");
        _TitleContainer.classList.add("title-container", "title-container-displayed");
        var _TitlecontainerInner = document.createElement("h2");
        _TitlecontainerInner.innerHTML = "Victoire !";
        _TitleContainer.appendChild(_TitlecontainerInner);
        document.body.appendChild(_TitleContainer);
        setTimeout(function(){
            _TitleContainer.remove();
        }, 3000);
    };

    this.BlobCoinsTaker = function(){
        document.getElementById("gbh-coins-taker").classList.remove("gbh-coins-taker-blob");
        setTimeout(function(){
            document.getElementById("gbh-coins-taker").classList.add("gbh-coins-taker-blob");
        }, 800);
    };

    this.StartNewGame = function(){
        document.getElementById("game-grid").innerHTML = "";
        document.getElementById("game-grid").style.transform = "translate3d(0, 0, 0)";
        document.getElementById("gbh-coins-taker").innerHTML = "";
        var LevelTypeIndex = Math.floor(Math.random() * (GamesLevels.length - 1));
        this.LevelType = new LevelObject(GamesLevels[LevelTypeIndex]);
        this.CurrentPage = 0;
        this.Selections = [];
        this.AllowedActions = this.LevelType.Level.Errors + (10 * this.LevelType.Level.PagesQty);
        this._Player.GetDatas();
        this.DisplayChapter();
        this.NextPage();
    };
}

function LevelObject(Level){
    this.Level = Level;
}

function Player(){
    this.Name = "Mimi";
    this.XP = 0;
    this.Chapter = 1;
    this.Pair = [];
    this.Page = 0;
    this.Actions = 0;
    this.PairsFound = 0;
    this.Errors = 0;

    this.GetDatas = function(){
        if(localStorage.getItem("PlayerMemoryDatas") != null){
            var _Datas = JSON.parse(localStorage.getItem("PlayerMemoryDatas"));
            this.Name = _Datas.Name;
            this.Chapter = _Datas.Chapter;
            this.XP = _Datas.XP;
        }
        this.Actions = 0;
        this.PairsFound = 0;
        this.Errors = 0;
        this.ResetProgressBar();
        this.ActualizeActions();
    };

    this.WriteDatas = function(){
        var _User = {
            Name: this.Name,
            Chapter: this.Chapter,
            XP: this.XP
        }
        if(localStorage.getItem("PlayerMemoryDatas") != null){
            localStorage.removeItem("PlayerMemoryDatas");
        }
        localStorage.setItem("PlayerMemoryDatas", JSON.stringify(_User));
    };

    this.DisplayDatas = function(){
        this.GetDatas();
        document.getElementById("player-xp").innerHTML = this.XP;
        document.getElementById("player-progress").innerHTML = this.PlayerProgress;
    };

    this.ActualizeProgressBar = function(){
        document.getElementById("cp-jauge").style.width = ((this.PairsFound / (Game.LevelType.Level.PagesQty * 10)) * 100)  + "%";
    }

    this.ActualizeActions = function(){
        document.getElementById("gbh-available-actions").innerHTML = this.Actions + "/" + Game.AllowedActions;
    }

    this.ResetProgressBar = function(){
        document.getElementById("cp-jauge").style.width = "";
    }

    this.CompareCards = function(_card){
        this.Pair.push(_card);
        var _this = this;
        if(this.Pair.length == 2){
            this.Actions++;
            this.ActualizeActions();
            Game.MakeVeil();
            if((this.Actions == Game.AllowedActions) && (this.PairsFound < (Game.CurrentPage * 10))){
                Game.Loose();
            }
            else{
                if((this.Pair[0].Card.Id == this.Pair[1].Card.Id) && (this.Pair[0].Card.FrontId != this.Pair[1].Card.FrontId)){
                    this.PairsFound++;
                    //SFX if Pair is OK
                    setTimeout(function(){
                        _this.Pair[0].Vanish();
                        _this.Pair[1].Vanish();
                        _this.ActualizeProgressBar();
                    }, 400);
                    Game.BlobCoinsTaker();
                    //SFX if Pair is OK
                    if(this.PairsFound == (Game.CurrentPage * 10)){
                        Game.NextPage();
                    }
                }
                else{
                    this.Errors++;
                    setTimeout(function(){
                        document.getElementById(_this.Pair[0].Card.FrontId).classList.add("bloc-hidden");
                        document.getElementById(_this.Pair[1].Card.FrontId).classList.add("bloc-hidden");
                    }, 500);
                }
            }
            setTimeout(function(){
                _this.Pair = [];
                document.getElementById("veil").remove();
            }, 800);
        }
    };
}

function Card(Card){
    this.Card = Card;
    this.User;
    this.Page;

    this.ShowCard = function(){
        this.classList.remove("bloc-hidden");
        var _Card = Game.Selections.find(card => card.Card.FrontId === this.id);
        _Card.User.CompareCards(_Card);
    };

    this.Vanish = function(){
        var _this = this;
        var _Elem = document.getElementById(_this.Card.FrontId);
        var _Particles = new ParticleSys(_this.Card.FrontId, "particle", 1500, 20, 20, 40, 200, [0, 1]);
        _Particles.RenderParticles();
        var _ElemRect = _Elem.getBoundingClientRect();
        _Elem.style.top = _ElemRect.top + "px";
        _Elem.style.left = _ElemRect.left + "px";
        document.body.appendChild(_Elem);
        var _TargetElem = document.getElementById("gbh-coins-taker");
        var _TargetElemRect = _TargetElem.getBoundingClientRect();
        setTimeout(function(){
            _Elem.style.top = _TargetElemRect.top + "px";
            _Elem.style.left = _TargetElemRect.left + "px";
            _Elem.style.width = _TargetElemRect.width + "px";
            _Elem.style.height = _TargetElemRect.height + "px";
            _Elem.style.zIndex = "1000000";
        }, 400);
        setTimeout(function(){
            _Elem.style.transition = "";
            _TargetElem.appendChild(_Elem);
            _Elem.style.top = "0px";
            _Elem.style.left = "0px";
            _Elem.style.width = "100%";
            _Elem.style.height = "100%";
            _Elem.style.zIndex = "";
            _Particles.KillParticles();
        }, 800);
    };

    this.DrawBloc = function(Index){
        var _Bloc = document.createElement("div");
        _Bloc.setAttribute("data-id", "bloc-" + this.Card.Id);
        _Bloc.id = this.Card.FrontId;
        _Bloc.classList.add("bloc");
        var _blocFront = document.createElement("div");
        _blocFront.classList.add("bloc-front");
        var _blocImg = document.createElement("img");
        _blocImg.src = "images/cards/" + this.Card.Avatar + ".jpg";
        _blocFront.appendChild(_blocImg);
        var _blocBack = document.createElement("div");
        _blocBack.classList.add("bloc-back");
        _Bloc.appendChild(_blocBack);
        _Bloc.appendChild(_blocFront);
        _Bloc.addEventListener('click', this.ShowCard, false);
        document.getElementById("cell-" + _Bloc.id).appendChild(_Bloc);
        setTimeout(function(){
            _Bloc.classList.add("bloc-revealed");
        }, (Index * 120));
    };
}