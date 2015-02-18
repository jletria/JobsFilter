// ==UserScript==
// @name CompaniesFilter
// @grant none
// @description A simple greasemonkey script to filter companies from itjobs.pt and net-empregos.com
// @downloadURL https://github.com/AceVentura/JobsFilter
// ==/UserScript==
// @include http://*.net-empregos.com/listagem_livre2.asp*
// @include http://*.itjobs.pt/emprego*

var CompaniesFilter = ["ItSector", "Versão Integral", "Degetel", "Dellent", "Match Profiler", "Noesis", "Link Consulting", "Rumos", "Upgrade m", "Cycloid", "Babel", "Xpand IT", "Tecnocom", "Glintt", "Askblue", "RPG", "Elevus", "Recursos Humanos", "INTEGRITY", "Syone", "Lusijob", " New Work Recruitment", "Habber Tec", "Iten Solutions", "Amaris", "bravemind", "Passio", "globalseven", "FindMore", "KCS", "ManPower", "Randstad", "Agap2", "Novabase", "Accenture", "Bee", "AdQuam" , "IT People", "iCreate", "Affinity", "BOLD", "PrimeIT", "Mind Source", "B.ON", "RUPEAL", "Experis", "Growin", "NetPeople", "Hays", "Aubay", "GFI", "Reditus", "Olisipo"];

function CleanArray()
{
	for(var i = 0; i < CompaniesFilter.length; i++)
    {
        CompaniesFilter[i] = CompaniesFilter[i].toLowerCase().replace(/\s/g, '');
    }
}


function GetNearestAncestor(htmlElementNode, ancestorType) 
{
    while (htmlElementNode) 
	{
        htmlElementNode = htmlElementNode.parentNode;
        if (htmlElementNode.tagName.toLowerCase() === ancestorType) 
		{
            return htmlElementNode;
        }
    }
    return null;
}


function DisableCompany(aElement, elementType, recursionLevels) 
{
	if(aElement == null || aElement == undefined)
		return false;
	for(var i = 0; i < CompaniesFilter.length; i++)
	{
		if(aElement.innerHTML.toLowerCase().replace(/\s/g, '').indexOf(CompaniesFilter[i]) >= 0)
		{
			var elementToHide = aElement;
			for(var j = 0; j < recursionLevels; j++)
			{
				elementToHide = GetNearestAncestor(elementToHide, elementType);
			}
			if(elementToHide != null)
			{
				elementToHide.style.display = "none";
				return true;
			}
		}
	}
	return false;
}



function SearchForCompaniesITJobs()
{
	CleanArray();
    var divList = document.getElementsByTagName("div");
	var totalOffers = 0;
	var removedOffers = 0;
    for(var i = 0; i < divList.length; i++)
    {
        if(divList[i].className != 'company')
        {
            continue;				
        }
		totalOffers++;
		if(DisableCompany(divList[i].firstElementChild, 'article', 1))
		{
			removedOffers++;
		}
    }
	if(totalOffers == 0 || totalOffers != removedOffers)
	return;
	var liElement = null;
	var liList = document.getElementsByTagName("li");
	for(var j = 0; j < liList.length; j++)
	{
		if(liList[j].className.indexOf("last") >= 0 && liList[j].className.indexOf("disabled") < 0)
		{
			liElement = liList[j];
			break;
		}
	}
	if(liElement != null)
	{
		liElement.firstElementChild.click();
	}	
}



function SearchForCompaniesNetEmpregos()
{
	CleanArray();
    var tdList = document.getElementsByTagName("td");
	var totalOffers = 0;
	var removedOffers = 0;
    for(var i = 0; i < tdList.length; i++)
    {
        var text = (tdList[i].innerText || tdList[i].textContent);
		if(text.toLowerCase().replace(/\s/g, '') == "empresa:")
        {
			totalOffers++;
        	if(DisableCompany(tdList[i].nextElementSibling, 'table', 2))
			{
				removedOffers++;
			}
		}
    }
	if(totalOffers == 0 || totalOffers != removedOffers)
		return;
	var imgElement = null;
	var imgList = document.getElementsByTagName("img");
	for(var j = 0; j < imgList.length; j++)
	{
		if(imgList[j].getAttribute('src').indexOf("images/next.GIF") >= 0)
		{
			imgElement = imgList[j];
			break;
		}
	}
	if(imgElement != null)
	{
		GetNearestAncestor(imgElement, 'a').click();
	}
}


if(window.location.href.toLowerCase().indexOf("itjobs") >= 0)
{
	SearchForCompaniesITJobs();
}
else if(window.location.href.toLowerCase().indexOf("net-empregos") >= 0)
{
	SearchForCompaniesNetEmpregos();
}