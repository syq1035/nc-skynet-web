import * as L from 'leaflet'
import 'proj4'
import 'proj4leaflet'
import Mapv from '../lib/Mapv.js'
// import h337 from 'heatmap.js'
import HeatmapOverlay from 'leaflet-heatmap'

const gis = {
  map:null,
  qsData:null,
  geojson:null,
  mapv:null,
  mapvLayer:null,
  wh_gis_init(type, el){
    const crs = new L.Proj.CRS("EPSG:4326", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
      {
        origin: [-180.0, 90.0],
        resolutions: [
          0.703125,
          0.3515625,
          0.17578125,
          0.087890625,
          0.0439453125,
          0.02197265625,
          0.010986328125,
          0.0054931640625,
          0.00274658203125,
          0.001373291015625,
          6.866455078125E-4,
          3.4332275390625E-4,
          1.71661376953125E-4,
          8.58306884765625E-5,
          4.291534423828125E-5,
          2.1457672119140625E-5,
          1.07288360595703125E-5,
          5.36441802978515625E-6,
          2.682209014892578125E-6,
          1.3411045074462890625E-6,
          6.7055225372314453125E-7
        ]
      });
    const url = 'http://10.137.8.2:7001/PGIS_S_TileMapServer/Maps/SL/EzMap?Service=getImage&Type=RGB&ZoomOffset=1&Col={x}&Row={y}&Zoom={z}&V=1.0.0'
    const center = type==='by'?[28.679627, 115.901053]:[28.688389, 115.859096]
    const zoom = 14

    this.map = L.map(el, {
      crs: crs,
      center: center,
      zoom: zoom,
      minZoom: 7,
      maxZoom: 18,
      forceDrawEverything: true
    });

    L.tileLayer(url).addTo(this.map);

  },
  h_wh_gis_init(type, el){
    const crs = new L.Proj.CRS("EPSG:4326", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
      {
        origin: [-180.0, 90.0],
        resolutions: [
          0.703125,
          0.3515625,
          0.17578125,
          0.087890625,
          0.0439453125,
          0.02197265625,
          0.010986328125,
          0.0054931640625,
          0.00274658203125,
          0.001373291015625,
          6.866455078125E-4,
          3.4332275390625E-4,
          1.71661376953125E-4,
          8.58306884765625E-5,
          4.291534423828125E-5,
          2.1457672119140625E-5,
          1.07288360595703125E-5,
          5.36441802978515625E-6,
          2.682209014892578125E-6,
          1.3411045074462890625E-6,
          6.7055225372314453125E-7
        ]
      });
    const url = 'http://10.137.8.2:7001/PGIS_S_TileMapServer/Maps/SL/EzMap?Service=getImage&Type=RGB&ZoomOffset=1&Col={x}&Row={y}&Zoom={z}&V=1.0.0'
    const center = type==='by'?[28.679627, 115.901053]:[28.688389, 115.859096]
    const zoom = 14

    var baseLayer = L.tileLayer(url)


    var cfg = {
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      "radius": .003,
      "maxOpacity": .8,
      // scales the radius based on map zoom
      "scaleRadius": true,
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries
      //   (there will always be a red spot with useLocalExtremas true)
      "useLocalExtrema": true,
      // which field name in your data represents the latitude - default "lat"
      latField: 'lat',
      // which field name in your data represents the longitude - default "lng"
      lngField: 'lng',
      // which field name in your data represents the data value - default "value"
      valueField: 'count',
      gradient: {
          // enter n keys between 0 and 1 here
          // for gradient color customization
          '0.4': 'red',
          '0.6': 'yellow',
          '0.7': 'lime',
          '0.8': 'blue',
          '1.0': 'cyan'
        }
    };
    this.heatmapLayer = new HeatmapOverlay(cfg);

    this.map = L.map(el, {
      crs: crs,
      center: center,
      zoom: zoom,
      minZoom: 7,
      maxZoom: 18,
      layers: [baseLayer, this.heatmapLayer],
      forceDrawEverything: true
    });

  },
  setCenter(type){
    const center = type==='by'?[28.679627, 115.901053]:[28.688389, 115.859096]
    this.map.setView(center)
  },
  drawArea(data){
    let features = []
    let keys = Object.keys(data)
    keys.forEach(key=>{
      features.push({
        type: "Feature",
        id: key,
        properties: {
          name: key,
          count: data[key].count
        },
        geometry: {
          type: "Polygon",
          coordinates: [data[key].points.map(item=>[item.lon,item.lat])]
        }
      })
    })

    let sData = {
      type: "FeatureCollection",
      features: features
    }

    function getColor(d) {
      return d > 1000 ? '#FFEDA0' :
        d > 500 ? '#FED976' :
        d > 200 ? '#FEB24C' :
        d > 100 ? '#FD8D3C' :
        d > 50 ? '#FC4E2A' :
        d > 20 ? '#E31A1C' :
        d > 10 ? '#BD0026' :
        '#800026';
        // return d > 1000 ? '#800026' :
        // d > 500 ? '#BD0026' :
        // d > 200 ? '#E31A1C' :
        // d > 100 ? '#FC4E2A' :
        // d > 50 ? '#FD8D3C' :
        // d > 20 ? '#FEB24C' :
        // d > 10 ? '#FED976' :
        // '#FFEDA0';
    }
    function style(feature) {
      return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5,
        fillColor: getColor(feature.properties.count)
      };
    }
    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
      });
    }
    function highlightFeature(e) {
      var layer = e.target;
      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.5
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      let context ='人口数量：'+layer.feature.properties.count+'人'
      layer.bindPopup(context).openPopup()
    }


    const resetHighlight = (e)=> {
      this.geojson.resetStyle(e.target);
      e.target.closePopup()
    }

    this.geojson = L.geoJson(sData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(this.map);
  },
  drawHeatMap(data){
    const mapJson = data.map(item => {
      return {
        lng: Number(item[2]),
        lat: Number(item[3]),
        count: Number(item[1])
      }
    })
    this.mapv = new Mapv({
      map: this.map,
      useLeaflet: true,
    })

    this.mapvLayer = new Mapv.Layer({
      mapv: this.mapv, // 对应的mapv实例
      zIndex: 1, // 图层层级
      dataType: 'point', // 数据类型，点类型
      data: mapJson, // 数据
      dataRangeControl: false, // 值阈控件
      drawType: 'heatmap', // 展示形式
      drawOptions: { // 绘制参数
        maxOpacity: 0.8, // 最大透明度，默认为0.8
        type: 'radius',  // 可选参数有rect(方形)和radius(圆形，默认)
        max: 500, // 设置最大的权重值
        shadowBlur: 15, // 默认15
        gradient: { // 渐变颜色值设置
          '0.4': 'red',
          '0.6': 'yellow',
          '0.7': 'lime',
          '0.8': 'blue',
          '1.0': 'cyan'
        }
        // gradient: { // 渐变颜色值设置
        //   '0.4': 'blue',
        //   '0.6': 'cyan',
        //   '0.7': 'lime',
        //   '0.8': 'yellow',
        //   '1.0': 'red'
        // }
      }
    })
  },
  removeGeoLayer(){
    this.geojson.remove()
  },
  removeMapvLayer(){
    this.mapvLayer.setMapv(null)
  },
  hDrawHeatMap(data){
    const mapJson = data.map(item => {
      return {
        lng: Number(item[2]),
        lat: Number(item[3]),
        count: Number(item[1])
      }
    })
    this.heatmapLayer.setData({
      data:mapJson
    });
  },
  hRemoveMapvLayer() {
    this.heatmapLayer.setData({
      max:0,
      data:[]
    });
  }
}

export default gis
