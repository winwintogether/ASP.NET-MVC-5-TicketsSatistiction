$(document).ready(function () {

    /*********************************Global Variable*******************************/
    var RequestNum = 0;
    var ResponseNum = 0;
    var selected_TicketId = null;
  
    var selected_tableGridId = 0;
    var selected_tableEventGridId = null;
    var Daterange = 10;
    /******************************   Shared Function *******************************/

    function ajaxRequest(type, url, data, dataType) { // Ajax helper

        var options = {
            dataType: dataType || "json",
            contentType: "application/json",
            cache: false,
            type: type,
            data: data ? JSON.stringify(data) : null,
            success: function (data) {
                ResponseNum++;
                CheckEndProcess();
            },
            error: function (xhr, status, error) {
                LoadingOff();

               //var err = eval("(" + xhr.responseText + ")");
               //if(err.message == undefined)
               //  alert("undefined error");
               //else
               //
                console.log(JSON.stringify(xhr));
                bootbox.alert(error);

            },
            timeout: 1000000
        };

        var antiForgeryToken = $("#antiForgeryToken").val();

        if (antiForgeryToken) {
            options.headers = {
                'RequestVerificationToken': antiForgeryToken
            };
        }

        return $.ajax(url, options);
    }

    function failCallback(elem) {

        bootbox.alert("Connetion error");

    }

    function loadComboData(combo, url, showKey, valKey, val) {

        ajaxRequest("get", url).done(function (data) {

            if (data.length > 0) {

                var options = [];
                options.push(["", ""]);

                $.each(data, function (i, v) {
                    options.push([v[valKey], v[showKey]]);
                    combo.append("<option value='" + v[valKey] + "'>" + v[showKey] + "</option>");
                });

                if (options.length > 0)

                    combo.val(options[0][0]);

                if (val != "")

                    combo.val(val);

            }
        }).fail(failCallback);
    }

    function loadGridData(url, grid, columnData) {

        ajaxRequest("get", url).done(function (data) {

            var tData = {};
            tData.total_count = data.length;
            tData.pos = 0;
            tData.data = data;

            grid.DataTable().clear();
            grid.DataTable().draw();

            console.log(url);
            $.each(data, function (i, v) {

                var row = [];

                $.each(columnData, function (j, k) {

                    row.push(v[columnData[j]]);
                });

                grid.DataTable().row.add(row);
                grid.DataTable().draw();
            });

        }).fail(function () {

            bootbox.alert("Error when loading data!");

        });
    }

    function LoadingOn() {
        $("#loading").addClass("loading");
    }

    function LoadingOff() {

        $("#loading").removeClass("loading");
    }

    function CheckEndProcess() {
        if (RequestNum == ResponseNum) {
            LoadingOff();
        }
    }

    function InitLoad(reqnum) {
        RequestNum = reqnum;
        ResponseNum = 0;
        LoadingOn();
    }

    /*****************************Quick Search**************************************/
    var totalTickets=0;
    var minTicketPrice = 0;
    var DrawChartData = [];
   
    function QuickDrawChart(chartData) {
        var volume = AmCharts.makeChart("volume_chart", {
            type: "stock",
            "theme": "light",
            pathToImages: "Content/assets/global/plugins/amcharts/amcharts/images/",
            "fontFamily": 'Open Sans',
            "color": '#888',

            dataSets: [{
                color: "#b0de09",
                fieldMappings: [{
                    fromField: "volume",
                    toField: "volume"
                },
                ],
                dataProvider: chartData,
                categoryField: "date"
            }],
           
            panels: [{
                title: "Value",
                percentHeight: 70,
                stockGraphs: [{
                    id: "g1",
                    valueField: "volume",
                    fillAlphas: 0.5,
                    fillColors: "#b0de09",
                }]
             }],
            
            panelsSettings: {
                //    "color": "#fff",
                marginLeft: 60,
                marginTop: 5,
                marginBottom: 5,
               
            },
            valueAxesSettings: {
                inside: false,
                showLastLabel: true
            },
            chartScrollbarSettings: {
                graph: "g1",
                color: "#00F"
            },
            chartCursorSettings: {
                valueBalloonsEnabled: true,
                graphBulletSize: 1,
                valueLineBalloonEnabled: true,
                valueLineEnabled: true,
                valueLineAlpha: 0.5
            },

            periodSelector: {
                dateFormat:"YYYY/MM/DD",
                periods: [{
                    period: "DD",
                    count: 10,
                    label: "10 days"
                }, {
                    period: "MM",
                    count: 1,
                    label: "1 month"
                }, {
                    period: "MM",
                    count: 3,
                    label: "3 months"
                }, {
                    period: "MM",
                    count: 6,
                    label: "6 months"
                }, {
                    period: "MAX",
                    label: "ALL"
                }]
            },

        });

        var average = AmCharts.makeChart("average_chart", {
            type: "stock",
            "theme": "light",
            pathToImages: "Content/assets/global/plugins/amcharts/amcharts/images/",
            "fontFamily": 'Open Sans',

            "color": '#888',
            dataSets: [{
                color: "#b0de09",
                fieldMappings: [{
                    fromField: "average",
                    toField: "average"
                },
              
                ],
                dataProvider: chartData,
                categoryField: "date"              
            }],

            panels: [{
                title: "Value",             
                percentHeight: 70,
                stockGraphs: [{
                    id: "g1",
                    valueField: "average",
                    fillAlphas: 0.5,
                    fillColors: "#b0de09",
                }],              
            }],
            panelsSettings: {
                //    "color": "#fff",
                marginLeft: 60,
                marginTop: 5,
                marginBottom: 5
            },
            valueAxesSettings: {
                inside: false,
                showLastLabel: true
            },
            chartScrollbarSettings: {
                graph: "g1",
                color: "#00F"
            },
            
            chartCursorSettings: {
                valueBalloonsEnabled: true,
                graphBulletSize: 1,
                valueLineBalloonEnabled: true,
                valueLineEnabled: true,
                valueLineAlpha: 0.5
            },

            periodSelector: {
                dateFormat: "YYYY/MM/DD",
                periods: [{
                    period: "DD",
                    count: 10,
                    label: "10 days"
                }, {
                    period: "MM",
                    count: 1,
                    label: "1 month"
                }, {
                    period: "MM",
                    count: 3,
                    label: "3 months"
                }, {
                    period: "MM",
                    count: 6,
                    label: "6 months"
                }, {
                    period: "MAX",
                    label: "ALL"
                }]
            },
        
        });

        var sold = 0;
        var date_from = "";
        var date_to = "";
        var dd;
        var yyyy;
        var mm;
        $.each(chartData, function (i, v) {
            if (i == 0) {
                date_from = new Date(v["date"]);
                 dd = date_from.getDate();
                 yyyy =date_from.getFullYear();
                 mm = date_from.getMonth() + 1;
                 if (dd < 10) {
                     dd = '0' + dd;
                 }
                 if (mm < 10) {
                     mm = '0' + mm;
                 }
                
                date_from = yyyy + '/' + mm + '/' + dd;

            }
            if (i == (chartData.length - 1)) {

                date_to = new Date(v["date"]);
                dd = date_to.getDate();
                yyyy = date_to.getFullYear();
                mm = date_to.getMonth() + 1;
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }

                date_to = yyyy + '/' + mm + '/' + dd;
            }
            sold += v["volume"];
            
        });
        
        var soldData = [{
            "sold": sold,
            "duration": date_from + "~" + date_to
        }];
        
        var sold_chart = AmCharts.makeChart(

          "sold_chart",
         {
             "type": "serial",
             "theme": "light",
             "fontFamily": 'Open Sans',
             "color": '#888888',
             "legend": {
                 "equalWidths": false,
                 "useGraphSettings": true,
                 "valueAlign": "left",
                 "valueWidth": 120
             },
             "dataProvider": soldData,
             "graphs": [{
                 "alphaField": "alpha",
                 "balloonText": "[[value]] ",
                 "dashLengthField": "dashLength",
                 "fillAlphas": 0.7,
                 "legendValueText": "[[value]]",
                 "title": "Number of Tickets sold",
                 "type": "column",
                 "valueField": "sold",
                 "valueAxis": "volumeAxis"
             }],
             "chartCursor": {
                 "categoryBalloonDateFormat": "DD",
                 "cursorAlpha": 0.1,
                 "cursorColor": "#000000",
                 "fullWidth": true,
                 "valueBalloonsEnabled": false,
                 "zoomable": false
             },
             "categoryField": "duration",
             "exportConfig": {
                 "menuBottom": "20px",
                 "menuRight": "22px",
                 "menuItems": [{
                     "icon": App.getGlobalPluginsPath() + "amcharts/amcharts/images/export.png",
                     "format": 'png'
                 }]
             }
         });

        var today = new Date();
         dd = today.getDate();
         yyyy = today.getYear();
         mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = yyyy + '/' + mm+'/'+dd;

        var availableData = [{
            "totalTickets": totalTickets,
            "duration":today
        }];
        var available_chart = AmCharts.makeChart(

         "available_chart",
        {
            "type": "serial",
            "theme": "light",
            "fontFamily": 'Open Sans',
            "color": '#888888',
            "legend": {
                "equalWidths": false,
                "useGraphSettings": true,
                "valueAlign": "left",
                "valueWidth": 120
            },
            "dataProvider": availableData,
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "[[value]] ",
                "dashLengthField": "dashLength",
                "fillAlphas": 0.7,
                "legendValueText": "[[value]]",
                "title": "Number of Tickets available",
                "type": "column",
                "valueField": "totalTickets",
                "valueAxis": "volumeAxis"
            }],
            "chartCursor": {
                "categoryBalloonDateFormat": "DD",
                "cursorAlpha": 0.1,
                "cursorColor": "#000000",
                "fullWidth": true,
                "valueBalloonsEnabled": false,
                "zoomable": false
            },
            "categoryField": "duration",
            "exportConfig": {
                "menuBottom": "20px",
                "menuRight": "22px",
                "menuItems": [{
                    "icon": App.getGlobalPluginsPath() + "amcharts/amcharts/images/export.png",
                    "format": 'png'
                }]
            }
        });

        var cheapestData = [{
            "minTicketPrice": minTicketPrice,
            "duration": today
        }];

        var cheapest_chart = AmCharts.makeChart(

         "cheapest_chart",
        {
            "type": "serial",
            "theme": "light",
            "fontFamily": 'Open Sans',
            "color": '#888888',
            "legend": {
                "equalWidths": false,
                "useGraphSettings": true,
                "valueAlign": "left",
                "valueWidth": 120
            },
            "dataProvider": cheapestData,
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "[[value]] ",
                "dashLengthField": "dashLength",
                "fillAlphas": 0.7,
                "legendValueText": "[[value]]",
                "title": "Cheapest active pair of tickets",
                "type": "column",
                "valueField": "minTicketPrice",
                "valueAxis": "volumeAxis"
            }],
            "chartCursor": {
                "categoryBalloonDateFormat": "DD",
                "cursorAlpha": 0.1,
                "cursorColor": "#000000",
                "fullWidth": true,
                "valueBalloonsEnabled": false,
                "zoomable": false
            },
            "categoryField": "duration",
            "exportConfig": {
                "menuBottom": "20px",
                "menuRight": "22px",
                "menuItems": [{
                    "icon": App.getGlobalPluginsPath() + "amcharts/amcharts/images/export.png",
                    "format": 'png'
                }]
            }
        });
       
    }

    function QuickSearchInit()   {

        $("#cbSaveQuickSearch").prop("checked", false);
        $("#cbSaveQuickSearch").prop('disabled', true);
        $("#txtEventId").prop('disabled', true);

        var cboQuickSearches = $("#cboQuickSearches");

        InitLoad(1);

        loadComboData(cboQuickSearches, "/api/QuickSearches/", "Name", "Id", '');

        QuickDrawChart([]);
    }
    
    $("#getZones").click(function () {

        InitLoad(1);
        $("#PickZones").empty();
        var eventId = $("#txtEventId").val();

        if (eventId != "") {

            ajaxRequest("get", "/api/eventzones/?eventId=" + eventId).done(function (data) {

                $.each(data, function (i, v) {
                    if(i<(data.length-2))                    
                        $("#PickZones").append("<option value='" + v["value"] + "'>" + v["text"] + "</option>")
                    if (i == (data.length - 2)) {
                        totalTickets = v["text"].split(":")[1];
                    }
                   
                    if (i == (data.length - 1))
                    {
                        minTicketPrice = v["text"].split(":")[1];
                    }
                    
                });

            });
        }
    });

    $("#cbDoNewQuickSearch").on("click", function () {

        if ($(this).is(':checked')) {

            $("#cbSaveQuickSearch").prop('disabled', false);
            $("#cboQuickSearches").prop('disabled', true);
            $("#txtEventId").prop('disabled', false);
            $("#cboQuickSearches").val("");
            $("#txtEventId").val("");
            $("#SectionFrom").val("");
            $("#SectionTo").val("");
            $("#LastWeekSalesOnly").prop("checked", false);

            $("#AllSales_1").val("");
            $("#AllTickets_1").val("");
            $("#AvgPrice_1").val("");
            $("#FilterSales_1").val("");
            $("#FilterTickets_1").val("");
            $("#FilterAvgPrice_1").val("");

            $("#AllSales_2").val("");
            $("#AllTickets_2").val("");
            $("#AvgPrice_2").val("");
            $("#FilterSales_2").val("");
            $("#FilterTickets_2").val("");
            $("#FilterAvgPrice_2").val("");

            $("#table_1").DataTable().clear();
            $("#table_1").DataTable().draw();
            $("#table_2").DataTable().clear();
            $("#table_2").DataTable().draw();
            $("#PickZones").empty();

            QuickDrawChart([]);

        } else {

            $("#cbSaveQuickSearch").prop("checked", false);
            $("#cboQuickSearches").val("");
            $("#cbSaveQuickSearch").prop("disabled", true);
            $("#cboQuickSearches").prop("disabled", false);
            $("#txtEventId").prop("disabled", true);

        }
    });

    $("#btnQuickSearch").on("click", function () {

        if (!$("#cboQuickSearches").is(':disabled'))
            return true;

        var eventId = $("#txtEventId").val();
        var isChecked = $("#cbSaveQuickSearch").is(':checked');
        var isSave = 0;
        var sectionFrom = $("#SectionFrom").val();
        var sectionTo = $("#SectionTo").val();
        var LastWeekSalesOnly = 0;
     
        var lwso = $("#LastWeekSalesOnly").is(':checked');

        if (lwso) LastWeekSalesOnly = 1;

        if (isChecked) isSave = 1;

        var all_zones = [];
        var select_zone = $("#PickZones").val();
       

        if (select_zone == null) {

           InitLoad(4);

           $("#PickZones").empty();

           ajaxRequest("get", "/api/eventzones/?eventId=" + eventId).done(function (data) {

             $.each(data, function (i, v) {
                    if (i < (data.length - 2))
                    {
                        $("#PickZones").append("<option value='" + v["value"] + "'>" + v["text"] + "</option>");                      
                    }
                    if (i == (data.length - 2)) {
                        totalTickets = v["text"].split(":")[1];
                    }

                    if (i == (data.length - 1)) {
                        minTicketPrice = v["text"].split(":")[1];
                    }
                   
                });

             $('#PickZones option').prop('selected', true);

             ajaxRequest("get", "/api/quicksearches/" + eventId + "?isNew=1&isSave=" + isSave + "&sectionFrom=" + sectionFrom + "&sectionTo=" + sectionTo + "&lastWeekSalesOnly=" + LastWeekSalesOnly + "&zones=" + all_zones).done(function (data) {

                 $("#txtEventId").val(data.EventId);
                 $("#SectionFrom").val(data.SectionFrom);
                 $("#SectionTo").val(data.SectionTo);
                 $("#LastWeekSalesOnly").val(data.LastWeekSalesOnly);

                 $("#AllSales_2").val(data.AllSales);
                 $("#AllTickets_2").val(data.AllTickets);
                 $("#AvgPrice_2").val(data.AvgPrice);
                 $("#FilterSales_2").val(data.FilterSales);
                 $("#FilterTickets_2").val(data.FilterTickets);
                 $("#FilterAvgPrice_2").val(data.FilterAvgPrice);

                 $("#PickZones").val("");

                 var qsTab2Grid = $("#table_2");
                 var columnData = ["Zone", "Section", "Row", "Price", "Qty", "DateSold"];

               
                 ajaxRequest("get", "/api/quicktickets/?quickId=" + data.Id + "&isSave=" + isSave).done(function (tdata) {

                     qsTab2Grid.DataTable().clear();
                     qsTab2Grid.DataTable().draw();

                     var date1 = new Date();
                     var date2 = null;

                     $.each(tdata, function (i, v) {

                         var row = [];

                         if (i == (tdata.length - 1)) date2 = new Date(v["DateSold"]);
                         $.each(columnData, function (j, k) {

                             row.push(v[columnData[j]]);
                         });

                         qsTab2Grid.DataTable().row.add(row);
                         qsTab2Grid.DataTable().draw();
                     });
                    
                 });

                 ajaxRequest("get", "/api/chartdata/?quickId=" + data.Id).done(function (data) {

                     DrawChartData = data;
                     QuickDrawChart(data);
                     
                 });

             });

            });
        } else {
            InitLoad(3);
          
            ajaxRequest("get", "/api/quicksearches/" + eventId + "?isNew=1&isSave=" + isSave + "&sectionFrom=" + sectionFrom + "&sectionTo=" + sectionTo + "&lastWeekSalesOnly=" + LastWeekSalesOnly + "&zones=" + select_zone).done(function (data) {

                console.log(select_zone);
                $("#txtEventId").val(data.EventId);
                $("#SectionFrom").val(data.SectionFrom);
                $("#SectionTo").val(data.SectionTo);
                $("#LastWeekSalesOnly").val(data.LastWeekSalesOnly);

                $("#AllSales_2").val(data.AllSales);
                $("#AllTickets_2").val(data.AllTickets);
                $("#AvgPrice_2").val(data.AvgPrice);
                $("#FilterSales_2").val(data.FilterSales);
                $("#FilterTickets_2").val(data.FilterTickets);
                $("#FilterAvgPrice_2").val(data.FilterAvgPrice);

                $("#PickZones").val("");

                var qsTab2Grid = $("#table_2");
                var columnData = ["Zone", "Section", "Row", "Price", "Qty", "DateSold"];

                ajaxRequest("get", "/api/quicktickets/?quickId=" + data.Id + "&isSave=" + isSave).done(function (tdata) {

                    qsTab2Grid.DataTable().clear();
                    qsTab2Grid.DataTable().draw();

                    var date1 = new Date();
                    var date2 = null;

                    $.each(tdata, function (i, v) {

                        var row = [];

                        if (i == (tdata.length - 1)) date2 = new Date(v["DateSold"]);
                        $.each(columnData, function (j, k) {

                            row.push(v[columnData[j]]);
                        });

                        qsTab2Grid.DataTable().row.add(row);
                        qsTab2Grid.DataTable().draw();
                    });

                                     
                });
                ajaxRequest("get", "/api/chartdata/?quickId=" + data.Id).done(function (data) {

                    DrawChartData = data;
                    QuickDrawChart(data);

                });
            });

        }
    });

    $("#btnExportToCSV").on("click", function () {

        var eventId = $("#txtEventId").val();
        var isChecked = $("#cbDoNewQuickSearch").is(':checked');
        var isNew = 0;

        if (isChecked) isNew = 1;

        window.location = "ExportToCSV/QuickSearchToCSV?eventid=" + eventId + "&isNew=" + isNew;
    });

    $("#cboQuickSearches").on("change", function () {
       

        if ($(this).val() != "") {

            totalTickets = 0;
            minTicketPrice = 0;

            InitLoad(5);

            ajaxRequest("get", "/api/quicksearches/" + $(this).val() + "?isNew=0&isSave=0").done(function (data) {

                if (data.Id != undefined) {

                    $("#txtEventId").val(data.EventId);
                    $("#SectionFrom").val(data.SectionFrom);
                    $("#SectionTo").val(data.SectionTo);
                    $("#LastWeekSalesOnly").val(data.LastWeekSalesOnly);
                    $("#chartduration").val(10);

                    $("#AllSales_1").val(data.AllSales);
                    $("#AllTickets_1").val(data.AllTickets);
                    $("#AvgPrice_1").val(data.AvgPrice);
                    $("#FilterSales_1").val(data.FilterSales);
                    $("#FilterTickets_1").val(data.FilterTickets);
                    $("#FilterAvgPrice_1").val(data.FilterAvgPrice);

                    $("#AllSales_2").val(data.AllSales);
                    $("#AllTickets_2").val(data.AllTickets);
                    $("#AvgPrice_2").val(data.AvgPrice);
                    $("#FilterSales_2").val(data.NewFilterSales);
                    $("#FilterTickets_2").val(data.NewFilterTickets);
                    $("#FilterAvgPrice_2").val(data.NewFilterAvgPrice);

                    ajaxRequest("get", "/api/eventzones/?eventId=" + data.EventId).done(function (data1) {

                        $.each(data1, function (i, v) {
                            if (i == (data1.length - 2)) {
                                totalTickets = v["text"].split(":")[1];
                            }

                            if (i == (data1.length - 1)) {
                                minTicketPrice = v["text"].split(":")[1];
                            }

                        });

                        qsTab1Grid = $("#table_1");
                        qsTab2Grid = $("#table_2");

                        var columnData = ["Zone", "Section", "Row", "Price", "Qty", "DateSold"];

                        loadGridData("/api/quicktickets/?quickId=" + data.Id + "&isNew=0", qsTab1Grid, columnData);
                        loadGridData("/api/quicktickets/?quickId=" + data.Id + "&isNew=1", qsTab2Grid, columnData);

                        ajaxRequest("get", "/api/chartdata/?quickId=" + data.Id).done(function (data) {
                            DrawChartData = data;
                            QuickDrawChart(data);

                        });
                    });
                   
                }

                $("#PickZones").empty();

            });
        }
    });

    $("#txtEventId").on("change", function () {

        $("#PickZones").empty();

    });
   
    $("#averagechart").on("mouseup", function () {
        setTimeout(function () {
            QuickDrawChart(DrawChartData);
        }, 100)
    });
    $("#volumechart").on("mouseup", function () {
        setTimeout(function () {
            QuickDrawChart(DrawChartData);
        }, 100)
    });
    /*************************Create Search******************************************/

    function loadSearches() {

        var showArchivedSearches = $('#showArchivedSearches').is(':checked');
        var archived = 0;
        if (showArchivedSearches)
            archived = 1;

        var grid = $("#table_3");
        var columnData = ["Id", "Name", "ScheduleString", "ScanDayBefore", "Archived"];

        loadGridData("/api/search/?archived=" + archived, grid, columnData);
    }

    $("#table_3 tbody").on("click", "tr", function () {

        var searchId = $(this).find("td:first-child").html();
        selected_tableGridId = searchId;
        selected_tableEventGridId = null;

        var grid = $("#table_4");
        var columnData = ["Id", "EventId", "EventTitle", "EventVenue", "EventDate", "Active"];

        InitLoad(1);
        loadGridData("/api/searchevent/?searchId=" + searchId, grid, columnData);

        $("#Name").val($(this).find("td:nth-child(2)").html());
        $("#Schedule").val($(this).find("td:nth-child(3)").html());
        $(this).find("td:nth-child(4)").html() == "true" ? $("#ScanDayBefore").prop("checked", true) : $("#ScanDayBefore").prop("checked", false);
        

    });

    $("#table_4 tbody").on("click", "tr", function () {

        selected_tableEventGridId = $(this).find("td:first-child").html();


    });

    $("#btnReload").on("click", function () {
        InitLoad(1);
        loadSearches();
        selected_tableGridId = 0;

    });

    $("#btnDeleteSelectedSearches").on("click", function () {

        if (selected_tableGridId != null) {
            InitLoad(2);
            ajaxRequest("delete", 'api/search/' + selected_tableGridId).done(function (data) {

                bootbox.alert("The searchItem has been deleted!");
                selected_tableGridId = null;
                loadSearches();
            });
        }
        else
            bootbox.alert("Please select a SearchItem!");
    });

    $("#btnDeleteSearchEvent").on("click", function () {

        if (selected_tableEventGridId != null) {
            InitLoad(2);
            ajaxRequest("delete", 'api/searchevent/' + selected_tableEventGridId).done(function (data) {

                bootbox.alert("The SearchEvent has been delete!");

                var grid = $("#table_4");
                var columnData = ["Id", "EventId", "EventTitle", "EventVenue", "EventDate", "Active"];

                loadGridData("/api/searchevent/?searchId=" + selected_tableGridId, grid, columnData);

                selected_tableEventGridId = null;

            });
        }
        else {
            bootbox.alert("Please select a event.");
        }
    });

    $("#btnAddSearchEvent").on("click", function () {

        var eventId = Number($("#txtEventId").val());

        if (eventId == 0 || isNaN(eventId)) {
            bootbox.alert("Invalid eventId");
        }
        else {

            var sTemp = { EventId: eventId, SearchId: selected_tableGridId };

            InitLoad(2);
            ajaxRequest('post', '/api/searchevent/', sTemp).done(function (data) {

                bootbox.alert("The event has been saved!");

                var grid = $("#table_4");
                var columnData = ["Id", "EventId", "EventTitle", "EventVenue", "EventDate", "Active"];

                loadGridData("/api/searchevent/?searchId=" + selected_tableGridId, grid, columnData);

            });
        }
    });

    $("#btnScanLink").on("click", function () {

        $("#txtEventTitle").val("");
        $("#txtVenue").val("");
        $("#bulkeventtable").DataTable().clear();
        $("#bulkeventtable").DataTable().draw();
    });

    $("#btnAddSearch").on("click", function () {

        var sData = {
            Name: $("#Name").val(),
            Schedule: $("#Schedule").val(),
            ScanDayBefore: $("#ScanDayBefore").is(":checked") ? 1 : 0,
            Id: selected_tableGridId
        };
    //    console.log(sData);
       InitLoad(2);

      ajaxRequest('post', '/api/search/', sData).done(function (data) {

          bootbox.alert("The search has been saved!");
            loadSearches();

        });
        
    });

    $("#btnEditSearch").on("click", function () {

        var sData = {
            Name: $("#Name").val(),
            Schedule: $("#Schedule").val(),
            ScanDayBefore: $("#ScanDayBefore").is(":checked") ? 1 : 0,
            Id: selected_tableGridId
        };
        InitLoad(2);
        ajaxRequest('put', '/api/search/' + selected_tableGridId, sData).done(function (data) {
            bootbox.alert("The search has been saved!");
            loadSearches();

        });
    });

    $("#btnClearSearchTemp").on("click", function () {

        var sData = {
            Name: $("#Name").val(),
            Schedule: $("#Schedule").val(),
            ScanDayBefore: $("#ScanDayBefore").is(":checked") ? 1 : 0,
            Id: selected_tableGridId
        };

        InitLoad(2);
        ajaxRequest("delete", 'api/searchevent/0').done(function (data) {

            bootbox.alert("The SearchEvent has been empty!");

            var grid = $("#table_4");
            var columnData = ["Id", "EventId", "EventTitle", "EventVenue", "EventDate", "Active"];
           
            loadGridData("/api/searchevent/?searchId=" + selected_tableGridId, grid, columnData);

            $("#Name").val("");
            $("#Schedule").val("");
            $("#ScanDayBefore").prop("checked", false);

        });
    });

    $("#btnSearchEvent").on("click", function () {

        var eventTitle = $("#txtEventTitle").val();
        var venue = $("#txtVenue").val();

        InitLoad(2);

        ajaxRequest("delete", 'api/bulksearch/0').done(function (data) {

            var eventsGrid = $("#bulkeventtable");
            var columnData = ["Scanned", "EventId", "EventTitle", "EventVenue", "EventDate"];

            var id_of_setinterval = setInterval(function () {
                loadGridData("/api/bulksearch", eventsGrid, columnData);
                RequestNum +=1;
            }, 10000);

            $.ajax({
                url: "/api/bulksearch?title=" + eventTitle + "&venue=" + venue,
                type: "GET",
                success: function (data, textStatus, jqXHR) {

                    loadGridData("/api/bulksearch", eventsGrid, columnData);
                   
                    alert("Search complete!");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    LoadingOff()
                    if (jqXHR.responseJSON != undefined) {
                        alert(jqXHR.responseJSON.errors[0].message);
                    }
                },
                complete: function (XMLHttpRequest, status) {
                    LoadingOff()
                    clearInterval(id_of_setinterval);
                    if (status == 'timeout') {
                        //ajaxTimeoutTest.abort();
                        alert("timeout");
                    }
                }

            });
        });

    });

    $("#btnSearchSave").on("click", function () {
        var searchId = selected_tableGridId;
        var ids = "";
        var eventsGrid = $("#bulkeventtable");
      
        $.map(eventsGrid.DataTable().rows('.selected').data(), function (item) {
            ids += item[1] + ",";
        });
            
        if (ids == "") {
            bootbox.alert("Please select at least 1 event.");
            return;
        }

        ajaxRequest('post', '/api/bulksearch/?searchId=' + searchId + '&ids=' + ids).done(function (data) {
            bootbox.alert("Save successful!");

            var searchEventsGrid = $("#table_4");
            var columnData = ["Id", "EventId", "EventTitle", "EventVenue", "EventDate", "Active"];
            loadGridData("/api/searchevent/?searchId=" + searchId, searchEventsGrid, columnData);
            $('#bulksearch').modal('hide');
        });
        

    });
    
    function CreateSearchInit() {

        InitLoad(1);
        loadSearches();

    }

    /*********************************Manual Scraping***********************************/

    function ManualScrapingInit() {

        $("#btnScrapingStop").prop("disabled", true);

        var cboSearches = $("#cboSearches");

        InitLoad(2);

        loadComboData(cboSearches, "/api/search/?archived=0", "Name", "Id", '');

        $("#btnScrapingStop_2").prop("disabled", true);

        ajaxRequest("get", "/api/scrapingmultisearches/").done(function (data) {

            $.each(data, function (i, v) {

                $("#multiSearches").append("<option value='" + v["value"] + "'>" + v["text"] + "</option>")

            });
        });
    }

    $("#cboSearches").on("change", function () {

        if ($(this).val() != "") {

            InitLoad(1);
            ajaxRequest("get", "/api/scrapingevent/?searchId=" + $(this).val()).done(function (data) {
                $.each(data, function (i, v) {
                 
                    $("#eventlist").append("<option value='" + v["value"] + "'>" + v["text"] + "</option>")
                });
            });
        }
        else {
            $("#eventlist").empty();
        }
    });

    $("#btnScrapingStart").on("click", function () {

        eventIds = $("#eventlist").val();

        $("#btnScrapingStop").prop("disabled", false);

        if (eventIds != null) {

            var l = Ladda.create(this);
            l.start();
          
            ajaxRequest("get", "/api/scrapingevent/?ids=" + eventIds).done(function (data) {

                var param = { SearchId: $("#cboSearches").val(), DateTime: new Date() };

                ajaxRequest("post", "/api/ExecuteSearch/", param).done(function (data) {
                  
                    bootbox.alert("Searching complete");
                    l.stop();
                });                               
            });
        }
        else {

            bootbox.alert("Please select at least 1 event.");
        }
    });

    $("#btnScrapingStop").on("click", function () {
        InitLoad(1);
        ajaxRequest("get", "/api/scrapingstop/").done(function (data) {

            alert("Searching stop");

        });
    });

    $("#btnDownload").on("click", function () {

        eventIds = $("#eventlist").val();

        if (eventIds != null)
            window.location = "ExportToCSV/ScrapingEventsToCSV?ids=" + eventIds;

    });

    $("#btnScrapingStart_2").on("click", function () {

        var searchIds = $("#multiSearches").val();

        if (searchIds != null) {

            var l = Ladda.create(this);
            l.start();

            ajaxRequest("get", "/api/scrapingmultisearches/?ids=" + searchIds).done(function (data) {

                var param = { SearchId: searchIds[0], DateTime: new Date() };

                ajaxRequest("post", "/api/ExecuteSearch/", param).done(function (data) {

                    bootbox.alert("Searching complete");
                    l.stop();
                });
            });
        }
        else {

            bootbox.alert("Please select at least 1 searchItem");
        }
        $("#btnScrapingStop_2").prop("disabled", false);

    });

    $("#btnScrapingStop_2").on("click", function () {
        InitLoad(1);
        ajaxRequest("get", "/api/scrapingstop/").done(function (data) {
            alert("Searching stop");
        });
    });

    $("#btnDownload_2").on("click", function () {

        var searchIds = $("#multiSearches").val();

        if (searchIds != null)
            window.location = "ExportToCSV/ScrapingMultiSearchesToCSV?ids=" + searchIds;

    });

    /*******************************Ticket Data*****************************************/
    var DrawTicketChartData = [];
    function TicketVolumeDrawChart(chartData) {

        var volumeDatasets = [];
        var volumechartData = [];
        var stockgraphs = [];
        var eventList = [];
        var oldeventId = "";

        $.each(chartData, function (i, v) {

            var item1 = { date: v["date"] };
            item1[v["eventId"]] = v["volume"];
            if (oldeventId != v["eventId"]) {
                oldeventId = v["eventId"];
                eventList.push(v["eventId"]);
            }

            volumechartData.push(item1);
       
        });
     
        for (i = 0; i < eventList.length; i++)
        {
            var item = {
                id: "g" + (i + 1),
                valueField: eventList[i],
                comparable: true,
                compareField: eventList[i],
                fillAlphas: 0.5,
                compareGraphFillAlphas:0.5,
                balloonText: "[[title]]:<b>[[value]]</b>",
                compareGraphBalloonText: "[[title]]:<b>[[value]]</b>"
                };
            stockgraphs.push(item);

            var volumeItem = [];
            $.each(volumechartData, function (j, v) {
                if (v[eventList[i]]) {
                    var child = { date: v["date"] };
                    child[eventList[i]] = v[eventList[i]];
                    volumeItem.push(child);
                }
            });
            var volumedataItem = {
               
                title: "EventId:" + eventList[i],
                fieldMappings: [{
                    fromField: eventList[i],
                    toField: eventList[i],
                }],
                dataProvider: volumeItem,
                categoryField:"date"
            }
            volumeDatasets.push(volumedataItem);
        }

      
        var volume = AmCharts.makeChart("volume_ticket_chart", {
            type: "stock",
            "theme": "light",
            pathToImages: "Content/assets/global/plugins/amcharts/amcharts/images/",
            "fontFamily": 'Open Sans',
            "color": '#888',

            dataSets: volumeDatasets,

            panels: [{
                title: "Value",
                percentHeight: 70,
                stockGraphs: stockgraphs,
            }],
            panelsSettings: {
                marginLeft: 60,
                marginTop: 5,
                marginBottom: 5
            },
            valueAxesSettings: {
                inside: false,
                showLastLabel: true
            },
            chartScrollbarSettings: {
                graph: "g1",
                color: "#00F"
            },
            chartCursorSettings: {
                valueBalloonsEnabled: true,
                graphBulletSize: 1,
                valueLineBalloonEnabled: true,
                valueLineEnabled: true,
                valueLineAlpha: 0.5
            },

            periodSelector: {
                dateFormat: "YYYY/MM/DD",
                periods: [{
                    period: "DD",
                    count: 10,
                    label: "10 days"
                }, {
                    period: "MM",
                    count: 1,
                    label: "1 month"
                }, {
                    period: "MM",
                    count: 3,
                    label: "3 months"
                }, {
                    period: "MM",
                    count: 6,
                    label: "6 months"
                }, {
                    period: "MAX",
                    label: "ALL"
                }]
            },
            dataSetSelector: {
                position: "left",
                listHeight:300
            },

        });
    }
    function TicketAverageDrawChart(chartData) {
        
        var averageDatasets = [];
        var averagechartData = [];
        var stockgraphs = [];
        var eventList = [];
        var oldeventId = "";

        $.each(chartData, function (i, v) {
            var item2 = { date: v["date"] };
            item2[v["eventId"]] = v["average"];

            if (oldeventId != v["eventId"]) {
                oldeventId = v["eventId"];
                eventList.push(v["eventId"]);
            }
            averagechartData.push(item2);
        });

        for (i = 0; i < eventList.length; i++) {
            var item = {
                id: "g" + (i + 1),
                valueField: eventList[i],
                comparable: true,
                compareField: eventList[i],
                fillAlphas: 0.5,
                compareGraphFillAlphas: 0.5,
                balloonText: "[[title]]:<b>[[value]]</b>",
                compareGraphBalloonText: "[[title]]:<b>[[value]]</b>"
            };
            stockgraphs.push(item);

            var averageItem = [];
            $.each(averagechartData, function (j, v) {
                if (v[eventList[i]]) {
                    var child = { date: v["date"] };
                    child[eventList[i]] = v[eventList[i]];
                    averageItem.push(child);
                }
            });
            var averagedataItem = {

                title: "EventId:" + eventList[i],
                fieldMappings: [{
                    fromField: eventList[i],
                    toField: eventList[i],
                }],
                dataProvider: averageItem,
                categoryField: "date"
            }
            averageDatasets.push(averagedataItem);
        }
        var average = AmCharts.makeChart("average_ticket_chart", {
             type: "stock",
             "theme": "light",
             pathToImages: "Content/assets/global/plugins/amcharts/amcharts/images/",
             "fontFamily": 'Open Sans',
             "color": '#888',
             dataSets: averageDatasets,
             panels: [{
                 title: "Value",
                 percentHeight: 70,
                 stockGraphs: stockgraphs,
             }],
             panelsSettings: {
                 marginLeft: 60,
                 marginTop: 5,
                 marginBottom: 5
             },
             valueAxesSettings: {
                 inside: false,
                 showLastLabel: true
             },
             chartScrollbarSettings: {
                 graph: "g1",
                 color: "#00F"
             },
             chartCursorSettings: {
                 valueBalloonsEnabled: true,
                 graphBulletSize: 1,
                 valueLineBalloonEnabled: true,
                 valueLineEnabled: true,
                 valueLineAlpha: 0.5
             },
 
             periodSelector: {
                 dateFormat: "YYYY/MM/DD",
                 periods: [{
                     period: "DD",
                     count: 10,
                     label: "10 days"
                 }, {
                     period: "MM",
                     count: 1,
                     label: "1 month"
                 }, {
                     period: "MM",
                     count: 3,
                     label: "3 months"
                 }, {
                     period: "MM",
                     count: 6,
                     label: "6 months"
                 }, {
                     period: "MAX",
                     label: "ALL"
                 }]
             },
             dataSetSelector: {
                 position: "left",
                 listHeight: 300
             }
          });
    }
    function TicketDataInit() {

        var searchlist = $("#SearchId");
        InitLoad(1);
        loadComboData(searchlist, "/api/search/?archived=0", "Name", "Id", '');

        ajaxRequest("get", "/api/ExecuteSearch").done(function (data) {
            if (data != "Nothing") {
                var LastDate = new Date(data);
                var dd = LastDate.getDate();
                var yyyy = LastDate.getFullYear();
                var mm = LastDate.getMonth() + 1;
                var hour = LastDate.getHours();
                var min = LastDate.getMinutes();
                var sec = LastDate.getSeconds();

                if (dd < 10) {
                    dd = '0' + dd;
                }

                if (mm < 10) {
                    mm = '0' + mm;
                }

                if (hour < 10) {
                    hour = '0' + hour;
                }

                if (min < 10) {
                    min = '0' + min;
                }

                if (sec < 10) {
                    sec = '0' + sec;
                }

                LastDate = "Last Successful Search DateTime: " + yyyy + '/' + mm + '/' + dd + " - " + hour + ":" + min + ":" + sec;

                $("#lastDate").empty();
                $("#lastDate").append(LastDate);
            }
            else {
                LastDate = "Last Successful Search DateTime: Nothing";

                $("#lastDate").empty();
                $("#lastDate").append(LastDate);
            }
        });

        TicketVolumeDrawChart([]);
    }

    $("#SearchId").on("change", function () {

        var eventlist = $("#EventId");

        if ($(this).val() != "") {

            eventlist.empty();
            InitLoad(1);
            loadComboData(eventlist, "/api/scrapingevent/?searchId=" + $(this).val(), "text", "value", '');
        }
        else {
            eventlist.empty();
        }

    });

    $("#btnLookupTickets").on("click", function () {
        
        var searchId = $("#SearchId").val();
        var eventId = $("#EventId").val();
        var eventTitle = $("#EventTitle").val();
        var eventVenue = $("#EventVenue").val();
        var startDate = $("#StartDate").val();
        var endDate = $("#EndDate").val();
        var zone = $("#Zone").val();
        var sectionForm = $("#SectionForm").val();
        var sectionTo = $("#SectionTo").val();
        var lastWeekSalesOnly = $("#LastWeekSalesOnly").is(":checked")? 1 : 0;
        var hidePastEvents = $("#HidePastEvents").is(":checked") ? 1 : 0;
        var showArchivedSearches = $("#ShowArchivedSearches").is(":checked") ? 1 : 0;

        if (searchId == null)
            searchId = 0;
        if (eventId == null)
            eventId = 0;
        if (startDate == "")
            startDate = null;
        if (endDate == "")
            endDate = null;

        var sdBtab1Grid = $("#table_5");
        var sdBtab2Grid = $("#table_6");
        var columnData1 = ["Id", "Title", "Venue", "Date", "Sales", "TicketsCount", "AvgPrice", "minTicketPrice", "averageTicketPrice", "TotalTickets"];
        var columnData2 = ["Id", "EventId", "EventTitle", "EventVenue", "EventDate", "Zone", "Section", "Row", "Price", "Qty", "DateSold"];

      
        InitLoad(3);

        loadGridData("/api/lookupevents/?searchId=" + searchId + "&eventId=" + eventId
            + "&title=" + eventTitle + "&venue=" + eventVenue + "&startDate=" + startDate + "&endDate=" + endDate
            + "&zone=" + zone + "&sectionForm=" + sectionForm + "&sectionTo=" + sectionTo
            + "&lastWeekSalesOnly=" + lastWeekSalesOnly + "&hidePastEvents=" + hidePastEvents + "&showArchivedSearches=" + showArchivedSearches, sdBtab1Grid, columnData1);

        loadGridData("/api/lookuptickets/?searchId=" + searchId + "&eventId=" + eventId
            + "&title=" + eventTitle + "&venue=" + eventVenue + "&startDate=" + startDate + "&endDate=" + endDate
            + "&zone=" + zone + "&sectionForm=" + sectionForm + "&sectionTo=" + sectionTo
            + "&lastWeekSalesOnly=" + lastWeekSalesOnly + "&hidePastEvents=" + hidePastEvents + "&showArchivedSearches=" + showArchivedSearches, sdBtab2Grid, columnData2);

        ajaxRequest("get", "/api/eventschart/?searchId=" + searchId + "&eventId=" + eventId
            + "&title=" + eventTitle + "&venue=" + eventVenue + "&startDate=" + startDate + "&endDate=" + endDate
            + "&zone=" + zone + "&sectionForm=" + sectionForm + "&sectionTo=" + sectionTo
            + "&lastWeekSalesOnly=" + lastWeekSalesOnly + "&hidePastEvents=" + hidePastEvents + "&showArchivedSearches=" + showArchivedSearches).done(function (data) {

                TicketVolumeDrawChart(data);
                TicketAverageDrawChart(data);
                DrawTicketChartData = data;
            });
       
        
    });

    $("#btnExportTicketsToCSV").on("click", function () {

        var ids = "";

        sdBtab1Grid = $("#table_5");

        sdBtab1Grid.DataTable().column(0).data().each(function (value, index) {

                       ids += value + ",";

                   });

        if (ids != "")

            window.location = "ExportToCSV/LookupTicketsToCSV?ids=" + ids;

    });

    $("#table_6 tbody").on("click", "tr", function () {

        selected_TicketId = $(this).find("td:first-child").html();

    });

    $("#btnDeleteSelectedTickets").on("click", function () {

        if (selected_TicketId != null) {
            InitLoad(2);
            ajaxRequest("delete", 'api/lookuptickets/' + selected_TicketId).done(function (data) {

                bootbox.alert("The ticket has been deleted!");

                var searchId = $("#SearchId").val();
                var eventId = $("#EventId").val();
                var eventTitle = $("#EventTitle").val();
                var eventVenue = $("#EventVenue").val();
                var startDate = $("#StartDate").val();
                var endDate = $("#EndDate").val();
                var zone = $("#Zone").val();
                var sectionForm = $("#SectionForm").val();
                var sectionTo = $("#SectionTo").val();
                var lastWeekSalesOnly = $("#LastWeekSalesOnly").is(":checked") ? 1 : 0;
                var hidePastEvents = $("#HidePastEvents").is(":checked") ? 1 : 0;
                var showArchivedSearches = $("#ShowArchivedSearches").is(":checked") ? 1 : 0;
                if (searchId == null)
                    searchId = 0;
                if (eventId == null)
                    eventId = 0;
                if (startDate == "")
                    startDate = null;
                if (endDate == "")
                    endDate = null;


                sdBtab2Grid = $("#table_6");
                var columnData2 = ["Id", "EventId", "EventTitle", "EventVenue", "EventDate", "Zone", "Section", "Row", "Price", "Qty", "DateSold"];

                loadGridData("/api/lookuptickets/?searchId=" + searchId + "&eventId=" + eventId
                    + "&title=" + eventTitle + "&venue=" + eventVenue + "&startDate=" + startDate + "&endDate=" + endDate
                    + "&zone=" + zone + "&sectionForm=" + sectionForm + "&sectionTo=" + sectionTo
                    + "&lastWeekSalesOnly=" + lastWeekSalesOnly + "&hidePastEvents=" + hidePastEvents + "&showArchivedSearches=" + showArchivedSearches, sdBtab2Grid, columnData2);

                selected_TicketId = null;

            });
        }
        else
            bootbox.alert("Please select a ticket!");

    });

    $("#averageticketchart").on("mouseup", function () {
        setTimeout(function () {
            TicketAverageDrawChart(DrawTicketChartData);
        }, 100)
    });

    $("#volumeticketchart").on("mouseup", function () {
        setTimeout(function () {
            TicketVolumeDrawChart(DrawTicketChartData);
        }, 100)
    });
   

    /*******************************Searching Log*****************************************/

    function SearchingLogInit() {
        var appLogGrid = $("#table_7");
        var columnData = ["CreatedOnUtc", "Message"];
        InitLoad(1);
        loadGridData("/api/applog/", appLogGrid, columnData);              
    }

    /**********************************User Mangement***********************************/
    function loadUsers() {
        InitLoad(1);
        var ColumnData = ["Id", "UserName", "Password", "IsAdmin", "ApiUserName", "ApiPassword", "Environment", "ConsumerKey", "ConsumerSecret", "ApplicationToken"];
        var userGrid = $("#table_9");

        loadGridData("/api/users/", userGrid, ColumnData);
    }

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function userformvalidate() {
        if (document.newForm.UserName.value == "") {

            document.newForm.UserName.focus();
            return false;

        } else {
            if (!validateEmail(document.newForm.UserName.value)) {

                document.newForm.UserName.focus();
                return false;
            }
        }

        if (document.newForm.Password.value == "") {

            document.newForm.Password.focus();
            return false;
        }
        if (document.newForm.APIUserName.value == "") {

            document.newForm.APIUserName.focus();
            return false;
        } else {
            if (!validateEmail(document.newForm.APIUserName.value)) {

                document.newForm.APIUserName.focus();
                return false;
            }
        }
        if (document.newForm.APIPassword.value == "") {

            document.newForm.APIPassword.focus();
            return false;
        }
        if (document.newForm.Environment.value == "") {

            document.newForm.Environment.focus();
            return false;
        }
        if (document.newForm.ConsumerKey.value == "") {

            document.newForm.ConsumerKey.focus();
            return false;
        }
        if (document.newForm.ConsumerSecretKey.value == "") {

            document.newForm.ConsumerSecretKey.focus();
            return false;
        }
        if (document.newForm.ApplicationToken.value == "") {

            document.newForm.ApplicationToken.focus();
            return false;
        }
        return (true);

    }

    function UserMangementInit() {
        loadUsers();
    }

    $("#btnnewuser").on("click", function () {
        $("#apipassword").val("");
        $("#apiusername").val("");
        $("#applicationtoken").val("");
        $("#consumerkey").val("");
        $("#consumersecretkey").val("");
        $("#environment").val("");
        $("#isadmin").prop('checked', false);
        $("#password").val("");
        $("#username").val("");
    });

    $("#btnCreateuser").on("click", function () {
        if (userformvalidate()) {
            var type = 'POST';
            var userData = {
                ApiPassword: $("#apipassword").val(),
                ApiUserName: $("#apiusername").val(),
                ApplicationToken: $("#applicationtoken").val(),
                ConsumerKey: $("#consumerkey").val(),
                ConsumerSecret: $("#consumersecretkey").val(),
                Environment: $("#environment").val(),
                IsAdmin: $("#isadmin").is(':checked') ? 1 : 0,
                Password: $("#password").val(),
                UserName: $("#username").val()
            };

            ajaxRequest('post', '/api/users/', userData).done(function (data) {
                bootbox.alert("The user has been saved!");
                loadUsers();
                $('#new_user').modal('hide');
            });

        }
    });

    $("#table_9").on("click", "tr", function () {
      
        $("#update_user").modal('show');

        $("#updateuserid").val($(this).find("td:nth-child(1)").html());
        $("#updateusername").val($(this).find("td:nth-child(2)").html());
        $("#updatepassword").val($(this).find("td:nth-child(3)").html());
        $(this).find("td:nth-child(4)").html() == 'true' ? $("#updateisadmin").parent().addClass('checked') : $("#updateisadmin").parent().removeClass('checked');
        $("#updateapiusername").val($(this).find("td:nth-child(5)").html());
        $("#updateapipassword").val($(this).find("td:nth-child(6)").html());
        $("#updateenvironment").val($(this).find("td:nth-child(7)").html());
        $("#updateconsumerkey").val($(this).find("td:nth-child(8)").html());
        $("#updateconsumersecretkey").val($(this).find("td:nth-child(9)").html());
        $("#updateapplicationtoken").val($(this).find("td:nth-child(10)").html());
      
    });

    $("#btnupdateuser").on("click", function (event) {
        event.preventDefault();
       
        var userData = {
            Id:$("#updateuserid").val(),
            ApiUserName: $("#updateapiusername").val(),
            ApiPassword: $("#updateapipassword").val(),

            ApplicationToken: $("#updateapplicationtoken").val(),
            ConsumerKey: $("#updateconsumerkey").val(),
            ConsumerSecret: $("#updateconsumersecretkey").val(),
            Environment: $("#updateenvironment").val(),
            IsAdmin: $("#updateisadmin").parent().hasClass('checked') ? "true" : "false",
            Password: $("#updatepassword").val(),
            UserName: $("#updateusername").val()
        };
        
       ajaxRequest("put", "/api/users/" + userData.Id, userData).done(function (data) {
           bootbox.alert("This user has been updated!");
            $("#update_user").modal('hide');
            loadUsers();
        });
        
    });

    /***********************************Other ********************************************/
  
    $("#logout").on("click", function (event) {
        event.preventDefault();
        $("#logoutForm").submit();

    });

    /***********************************Initionalize*************************************/

    switch ($("#currentpage").val()) {

        case "1":
            console.log("Here is QuickSearch");
            QuickSearchInit();
            break;
        case "2":
            console.log("Here is CreateSearch");
            CreateSearchInit();
            break;
        case "3":
            console.log("Here is ManualScraping");
            ManualScrapingInit();
            break;
        case "4":
            console.log("Here is TicketData");
            TicketDataInit();
            break;
        case "5":
            console.log("Here is SearingLog");
            SearchingLogInit();
            break;
        case "6":
            console.log("Here is UserManagement");
            UserMangementInit();
            break;
        default:
            break;
    }

    if (jQuery().datepicker) {
        $('.date-picker').datepicker({
            rtl: App.isRTL(),
            orientation: "left",
            autoclose: true
        });
    }

});