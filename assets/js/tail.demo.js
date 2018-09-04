(function(){
	"use strict";

    /*
     |  HELPER METHODs
     |  @since  0.1.2
     */
    var tail = {
        hasClass: function(element, classname){
            var regex = new RegExp("(|\s+)" + classname + "(\s+|)");
            return regex.test(element.className);
        },
        addClass: function(element, classname){
            if(!this.hasClass(element, classname)){
                element.className = (element.className.trim() + " " + classname.trim()).trim();
            }
            return element;
        },
        removeClass: function(element, classname){
            var regex = new RegExp("(|\s+)(" + classname + ")(\s+|)");
            if(regex.test(element.className)){
                element.className = (element.className.replace(regex, "$1$3")).trim();
            }
            return element;
        }
    };

	document.addEventListener("DOMContentLoaded", function(){
		/*
		 |	PAGE SWITCH
		 |	@since	2.0.0
		 */
		var hash 		= window.location.hash,
			items 		= document.querySelectorAll("li.item-intern a"),
			contents 	= document.querySelectorAll("div.content-page"),
			pageSwitch	= function(event){
				event.preventDefault();
				for(var i = 0; i < items.length; i++){
					if(items[i].hash === this.hash){
						items[i].parentElement.className = "navi-item active";
					} else {
						items[i].parentElement.className = "navi-item";
					}
				}

				for(var i = 0; i < contents.length; i++){
					if("#" + contents[i].getAttribute("id") === this.hash){
						contents[i].style.display = "block";
					} else {
						contents[i].style.display = "none";
					}
				}
			};
		if(items.length > 0){
			if(hash === ""){ hash = items[0].hash; }
			for(var i = 0; i < items.length; i++){
				items[i].addEventListener("click", pageSwitch);
				if(items[i].hash === hash){
					items[i].click();
				}
			}
		}

        /*
         |  TOGGLE
         |  @since  2.0.0
         */
        var toggles = document.querySelectorAll("[data-toggle]");
        for(var i = 0; i < toggles.length; i++){
            toggles[i].addEventListener("click", function(event){
                event.preventDefault();

                var target = this;
                if(this.hasAttribute("data-target")){
                    target = document.querySelector(this.getAttribute("data-target"));
                }

                if(!tail.hasClass(target, "active")){
                    tail.addClass(target, "active");
                } else {
                    tail.removeClass(target, "active");
                }
            });
        }

		/*
		 |	WIDGET CONTENT SWITCH
		 |	@since	2.0.0
		 */
		var action		= document.querySelectorAll(".widget header .widget-option"),
			artSwitch	= function(event){
				event.preventDefault();
				var articles 	= this.parentElement.parentElement.parentElement.querySelectorAll("article"),
					string		= this.getAttribute("title").split("|"),
					option		= this.getAttribute("data-option").split("|"),
					icon		= this.children[0].getAttribute("data-icon");

				for(var i = 0; i < articles.length; i++){
					if(articles[i].className === option[0]){
						articles[i].style.display = "block";
					} else {
						articles[i].style.display = "none";
					}

				}
				this.setAttribute("title", string[1] + "|" + string[0]);
				this.setAttribute("data-option", option[1] + "|" + option[0]);
				this.children[0].setAttribute("data-icon", this.children[0].className);
				this.children[0].className = icon;
			};
		if(action.length > 0){
			for(var i = 0; i < action.length; i++){
				action[i].addEventListener("click", artSwitch);
				action[i].click();
			}
		}

		/*
		 |	TOOLTIP
		 |	@since	2.0.0
		 */
		var tooltip 	= document.querySelectorAll(".tooltip"),
			tooltipID	= 0,
			toolSwitch	= function(event){
				event.preventDefault();

				if(event.type === "mouseenter"){
					if(this.getAttribute("data-tooltip") == null){
						// Create Element
						var tooltip 			= document.createElement("DIV");
							tooltip.id 			= "tooltip-" + tooltipID;
							tooltip.innerText	= this.title;
							tooltip.className 	= "tooltip-container";
						var toolicon			= document.createElement("SPAN");
							tooltip.appendChild(toolicon);

						// Get Offset Position
						var temp = this, position = {top: this.offsetHeight, left: 0, width: 0};
						while(true){
							position.top 	+= temp.offsetTop;
							position.left	+= temp.offsetLeft;
							if(temp.offsetParent === null){
								break;
							}
							temp = temp.offsetParent;
						}

						// Get Limitation
						var temp = this.parentElement;
						while(true){
							if(temp.className.match(/container/)){
								var limit = {
									min: temp.offsetLeft+10,
									max: temp.offsetLeft-10 + temp.offsetWidth
								};
								break;
							}
							if(temp.parentElement === null){
								break;
							}
							temp = temp.parentElement;
						}

						// Calculate Position
						if(limit !== undefined){
							var test = tooltip.cloneNode(true);
								test.style.visibility = "hidden";

							document.body.appendChild(test);
							position.width = test.offsetWidth;
							test.remove();

							var wuff = position.left + this.offsetWidth/2;
							position.left = position.left - (position.width/2) + (this.offsetWidth/2);

							if(position.left < limit.min){
								position.left = limit.min;
								toolicon.style.left = this.offsetWidth/2 + "px";
								toolicon.style.margin = 0;
							} else if((position.left + position.width) > limit.max){
								position.left = (limit.max - position.width);
								toolicon.style.left = wuff - position.left - 8 + "px";
								toolicon.style.margin = 0;
							}
						}
						tooltip.style.top 	= position.top + "px";
						tooltip.style.left 	= position.left + "px";

						// Perform
						this.setAttribute("data-tooltip", "tooltip-" + tooltipID);
						this.removeAttribute("title");
						document.body.appendChild(tooltip);
						tooltipID++;
					}
				} else if(event.type === "mouseleave"){
					if(this.getAttribute("data-tooltip") !== null){
						var tooltip = document.querySelector("#" + this.getAttribute("data-tooltip"));

						if(tooltip !== null){
							this.removeAttribute("data-tooltip");
							this.setAttribute("title", tooltip.innerText);
							tooltip.remove();
						}
					}
				}
			};
		if(tooltip.length > 0){
			for(var i = 0; i < tooltip.length; i++){
				tooltip[i].addEventListener("mouseenter", toolSwitch);
				tooltip[i].addEventListener("mouseleave", toolSwitch);
			}
		}
	});
})(window, document);
