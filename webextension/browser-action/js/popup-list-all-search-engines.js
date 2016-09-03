/**
 * Created by Deekshith Allamaneni on 11/28/15.
 * Copyright 2016 Deekshith Allamaneni
 */

"use strict";

function getDefPrefsRestorePopupOptions () {
    textFileLoad(chrome.extension.getURL("../../data/data.json")).then(function(response) {
        chrome.storage.local.get({
            user_config: response
        }, function (items) {
            console.log("items.user_config: ", items.user_config);
            restoreListAllSearchEnginesPopupOptions(
                new UserConfig(JSON.parse(response))
            );
        });
    }, function(Error) {
        console.log(Error);
    });
}


function restoreListAllSearchEnginesPopupOptions (thisUserConfig) {
        function generateSearchEngineListNodes(searchEngineList) {
            return searchEngineList.reduce((listHTML, searchEngineItem) => {
                return listHTML+`<button id="search-item-${generateUuid()}" class="list-group-item">${searchEngineItem.name}</button>`;
            },"");
        }

        function generateSearchEngineCategoryListNodes(category) {
            let collapseID = `search-category-${generateUuid()}`;
            let categoryHtml = `
            <div class="panel panel-default">
                    <div class="list-group status">
                        <button class="list-group-item btn btn-lg" data-toggle="collapse" data-parent="#accordion" href="#${collapseID}">
                            ${category}
                        </button>
                    </div>

                <div id="${collapseID}" class="panel-collapse collapse">
                    <div class="list-group">
                        ${generateSearchEngineListNodes(thisUserConfig.getSearchEnginesByCategory(category))}
                    </div>
                </div>
            </div>
            `;

            return categoryHtml;
        }

        let categoryNodes = thisUserConfig.getSearchEngineCategories()
            .reduce((previousHtml, eachSearchCategory) => {
                return previousHtml+generateSearchEngineCategoryListNodes(eachSearchCategory);
            }, "");
        document.getElementById("accordion").innerHTML=categoryNodes;
}

document.addEventListener('DOMContentLoaded', getDefPrefsRestorePopupOptions);