(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by roper on 2017/9/11.
 */
$(document).ready(function () {
  (function ($) {

    //构建辽宁地图
    $('<div style="">' +
      '<div id="china" style="display:none;"></div>' +
      '<div id="province">' +
      '</div>' +
      '</div>').appendTo('#c1');
    function processData(mapData) {
      var result = [];
      var features = mapData.features;
      for (var i = 0; i < features.length; i++) {
        var name = features[i].properties.name;
        result.push({
          "name": name,
          "value": 2000,
          "重点监测观察表": 0,
          "不良事件报告表": 0,
          "不良事件发生率": '20%'
        });
      }
      return result;
    }

    //渲染各个市区的数据地图
    function renderProvinceChart(provinceChart, name) {
      var provinceData = ChinaGeoJSON[name];
      provinceChart.clear();
      provinceChart.source(processData(provinceData));
      provinceChart.legend({
        position: 'left'
      });
      provinceChart.polygon().position(Stat.map.region('name', provinceData)).tooltip('重点监测观察表*不良事件报告表*不良事件发生率')
        .label('name', {
          label: {
            fill: '#FF0000'
          }
        })
        .style({
          stroke: '#fff',
          lineWidth: 1
        })
        .color('value', '#e5f5e0-#31a354');
      provinceChart.render();
    }

    var Stat = G2.Stat;
    var mapData = ChinaGeoJSON['China'];
    var chart = new G2.Chart({
      id: 'china',
      width: 200,
      height: 120,
      plotCfg: {
        margin: [0, 10]
      }
    });
    chart.source(processData(mapData));
    chart.tooltip({
      title: null
    });
    chart.polygon().position(Stat.map.region('name*me*value', mapData)).tooltip('name*me*value')
      .style({
        stroke: '#999',
        lineWidth: 2,
        fill: '#ccc',
        globalAlpha: 0.9,
        cursor: 'pointer' // 设置鼠标手势
      }).selected({ // 设置是否允许选中以及选中样式
      mode: 'single', // 多选还是单选
      style: {
        fill: '#fe9929' // 选中的样式
      }
    });
    chart.render();
    var provinceChart = new G2.Chart({
      id: 'province',
      width: 450,
      height: 450,
      plotCfg: {
        margin: [20, 20, 40, 80]
      }
    });
    var shapeData = chart.getAllGeoms()[0].getData();
    for (var i = 0, len = shapeData.length; i < len; i++) {
      var item = shapeData[i];
      var origin = item['_origin'];
      var name = origin.name;
      if (name === '辽宁') {
        renderProvinceChart(provinceChart, name);
        chart.getAllGeoms()[0].setSelected(item);
      }
    }
    chart.on('plotclick', function (ev) {
      var shape = ev.shape;
      if (shape && shape.get('selected')) {
        var item = shape.get('origin');
        var data = item['_origin'];
        var name = data.name;
        renderProvinceChart(provinceChart, name);
      } else {
        provinceChart.clear();
      }
    });
  })(jQuery);
});

},{}]},{},[1]);
