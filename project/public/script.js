var q_list = [];
var rating = 0;
var level = 1;
category = 1;

function GetExc(category, level) {
    $.ajax({
        url: "/test",
        type: "POST",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
            category: category,
            level: level
        }),
        success: function (questions) {
          //Math.round(Math.random() * (max - min) + min)
          //Смотрим, чтобы в массиве полученных вопросов не было вопроса, который мы уже показывали
          var new_quest = [];
          var questionsParsed = JSON.parse(questions);
          var inp;
          questionsParsed.forEach(function(q) {
            inp = true;
            if (!q_list.length) {
              new_quest.push(q);
            } else {
              q_list.forEach(function (q_1){
                if (q.id_question === q_1.id_question) {
                  inp = false;
                }
              });
              if (inp === true){
                new_quest.push(q);
              }
             }
          });

          var n = new_quest.length - 1;
          var m = 0;
          var num_get = randomInteger(m,n);
          if (new_quest[num_get].name_question === undefined){
            console.log('УПС');
          }
          $("form div").append(new_quest[num_get].name_question);

          var var_string = new_quest[num_get].var_question;
          var vars = var_string.split("/");
          console.log(new_quest[num_get]);

          $.each(vars, function(index, v){
            inp = '<p><input type="radio" name="answer" value="'+ index +'">' + v + '<Br>';
            lab = $("form div").append(inp);
          });
          q_list.push(new_quest[num_get]);
        }
    });

}

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
};

function PushAnswer(id, num_var){
  $.ajax({
    url: "/push",
    contentType: "application/json",
    method: "POST",
    async: false,
    data: JSON.stringify({
        var_question: num_var,
        id_answer: id
    }),
    success: function (data) {
      $("div.resp").html('');
      $("div.total").html('');

        if (data.point === 1) {
          $("div.resp").append("<p>Ответ на вопрос " + (questions_total+1) + " верный!</p>");
          rating = rating + 1;
          console.log('rating after push: ' + rating);
          console.log('level after push: ' + level);
        } else {
          $("div.resp").append("<p>Ответ на вопрос " + (questions_total+1) + " неверный!</p>");
          if (rating > 0){
            rating = rating - 1;
            console.log('rating after push: ' + rating);
            console.log('level after push: ' + level);
          }
          if (rating === 0 && level > 1) {
            rating = rating - 1;
            console.log('rating after push: ' + rating);
            console.log('level after push: ' + level);
          }
        }
        //console.log(rating);
    }
})
}

function check_rating(rating, level){
  if (rating >=2) {
    level += 1;
    $("div.resp").append("<p>Ура! Ты прошел на новый уровень!</p>");
    rating = 0;
    console.log('new level: ' + level);
    console.log('new rating: ' + rating);
  }
  if (rating === -1){
    level = level - 1;
    $("div.resp").append("<p>Ой... Ты упал!</p>");
    rating = 0;
    console.log('new level: ' + level);
    console.log('new rating: ' + rating);
  }
  return [level, rating]
}

function get_final(id_lev) {
  $.ajax({
    url: "/get_cat",
    contentType: "application/json",
    method: "POST",
    async: false,
    data: JSON.stringify({
        id_lev: id_lev,
    }),
    success: function (data) {
      lev = JSON.parse(data);
      console.log(lev[0].rang_level);
      level_cat = lev[0].rang_level
    }
  });
  return level_cat
}

$("#test").submit(function (e) {
    e.preventDefault();
    var num_var = this.elements["answer"].value;
    var b = q_list[q_list.length - 1].id_question;
    PushAnswer(b, parseInt(num_var)+1);
    //console.log(rating);
    res = check_rating(rating, level);
    rating = res[1];
    level = res[0];
    questions_total += 1;
    //$("div.resp").append("<p>Total: " + (questions_total +1) + "</p>");

    if (questions_total === 12){
      if (category === 1){
        str_category = 'орфография';
      };
      if (category === 2){
        str_category = 'морфология';
      };
      if (category === 3){
        str_category = 'синтаксис и словоупотребление';
      };

      $("div.resp").append("<p>Молодец! Ты закончил категорию " + str_category + "</p>");
      if (level === 7){
        user_results[category] = level - 1;
      } else {
        user_results[category] = level
      }
      console.log(level);
      category += 1;
      questions_total = 0;
      level = 1;
      if (category === 4){
        $("div.finals").append("<p>Невероятно! Ты прошел этот тест! Вот твои результаты:</p>");
        //console.log('Невероятно! Ты прошел этот тест! Вот твои результаты:')
        var mid_lev = 0;
        mid_lev = user_results['1'] + user_results['2'] + user_results['3'];
        mid_lev = Math.round(mid_lev/3);



        $("div.finals").append("<p>Орфография: " + get_final(user_results['1'])+"</p>");
        console.log('Орфография' + user_results['1']);
        //console.log("Орфография: " + get_final(user_results['1']));
        $("div.finals").append("<p>Морфология: " + get_final(user_results['2'])+"</p>");
        console.log("Морфология: " + user_results['2']);
        $("div.finals").append("<p>Синтаксис и словоупотребление: " + get_final(user_results['3'])+"</p>");
        console.log("Синтаксис и словоупотребление: " + user_results['3']);
        $("div.finals").append("<p>Ты владеешь русским языком на уровне: " + get_final(mid_lev)+"</p>");
      } else {
        $("div.total").append("<p>Вопрос: " + (questions_total +1) + "</p>");
        console.log(user_results);
      }
    } else {
      $("div.total").append("<p>Вопрос: " + (questions_total +1) + "</p>");
    }

    // setTimeout(function(){
    //
    // }, 2000)
    if (q_list.length !== 36){
      $("div.test").remove();
      $("button").remove()
      $("form").append("<div class='test'></div>")
      $("form").append('<button type="submit" class="btn btn-sm btn-primary">'+'Дальше' + '</button>')
    } else {
      $("div.test").remove();
      $("button").remove()
    }


    if (category !== 4){
      GetExc(category, level);
    };
});

var questions_total = 0;
var user_results = {};
$("#greet").submit(function (e) {
    e.preventDefault();
    $("div.greeting").remove();
    GetExc(category, level);
    $("div.resp").append("<p>Вопрос: " + (questions_total+1) + "</p>");
    $("form").append('<button type="submit" class="btn btn-sm btn-primary">'+'Дальше' + '</button>')
});


//get_final(1)
