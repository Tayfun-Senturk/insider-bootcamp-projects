$(document).ready(function() {
    var studentData = [
        { name: "Ali", class: "10A" },
        { name: "Veli", class: "9B" },
        { name: "Mehmet", class: "11C" },
        { name: "Ayşe", class: "10A" },
        { name: "Fatma", class: "9B" },
        { name: "Ahmet", class: "11C" },
        { name: "Zeynep", class: "10A" },
        { name: "Ece", class: "9B" },
        { name: "Deniz", class: "11C" }
    ];

    function renderTable() {
        var tbody = $("#student-table tbody");
        tbody.empty();
        $.each(studentData, function(index, student) {
            var row = $("<tr>")
                .append($("<td>").text(student.name))
                .append($("<td>").text(student.class))
                .append($("<td>").html("<button class='delete-btn' data-index='" + index + "'>Delete</button>"));
            tbody.append(row);
        });
    }

    renderTable();

    $("#student-form").submit(function(e) {
        e.preventDefault();
        var name = $("#name").val().trim();
        var cls = $("#class").val().trim();
        if (name && cls) {
            studentData.push({ name: name, class: cls });
            renderTable();
            $("#name").val("");
            $("#class").val("");
        } else {
            alert("Lütfen isim ve sınıf girin!");
        }
    });

    $("#student-table").on("click", ".delete-btn", function() {
        var index = $(this).data("index");
        studentData.splice(index, 1);
        renderTable();
    });

    $("#student-table").on("click", "tr", function() {
        $(this).toggleClass("selected");
    });

    $("#student-table").on("mouseover", "tr", function() {
        $(this).addClass("highlight");
    }).on("mouseout", "tr", function() {
        $(this).removeClass("highlight");
    });
    
    $("#student-table").on("dblclick", "tr", function() {
        $(this).css("font-weight", "bold");
        setTimeout(function() {
            $(this).css("font-weight", "normal");
        }.bind(this), 1000);
    });
    
    $("#name, #class").focus(function() {
        $(this).css("background-color", "#f8f8f8");
    }).blur(function() {
        $(this).css("background-color", "");
    });
}); 