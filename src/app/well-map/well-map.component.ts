/* tslint:disable */

import { environment } from '../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { markers } from "./mockdata";
import { data1 } from "./data/data1";

@Component({
  selector: 'well-map',
  templateUrl: './well-map.component.html',
  styleUrls: ['./well-map.component.css']
})
export class WellMapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v10';
  lat = 37.830348;
  lng = -122.486052;
  markers: any = markers;
  routeData: any;
  count: number = 0;
  constructor() { }

  ngOnInit() {
    this.initMap();
    // this.addMarkers();
    this.getRouteData();
  }

  private getRouteData(): void {
    this.routeData = data1.features[0].geometry.coordinates;
  }

  private initMap(): void {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;

    this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 15,
        center: [
          -73.78299,
          40.64857
       ],
    });

    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on("load", () => {
      this.addMarkerSource();
      this.addMarkerLayer();
      // this.addLineSource();
      // this.addLineLayer();  
      // function animateMarker() {
      //   this.map.getSource('point').setData(this.pointPosition(this.routeData[this.count]));
      //   this.count++;
      //   requestAnimationFrame(animateMarker);
      // }
         
        // Start the animation.
      this.animateMarker();      
    });

    this.map.on("click", "point", (e) => {
      console.log(123, e);
    });
  }
 



  private produceMarkerGeoJSON(markers): any {
    return {
      "type": "FeatureCollection",
      "features": markers.map((each) => {
        return {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            coordinates: [each.lng, each.lat]
          }
        }
      })
    }
  }

  private animateMarker(): void {
    const source: mapboxgl.GeoJSONSource = this.map.getSource('point') as mapboxgl.GeoJSONSource;
    const routeInterval  = window.setInterval(() => {
      source.setData(this.pointPosition(this.routeData[this.count]));
      this.count++; 
      if (this.count === this.routeData.length) {
        window.clearInterval(routeInterval)
      }
    }, 16);
  }

  private pointPosition(marker): any {
    return {
      "type": "Point",
      "coordinates": [marker[0],  marker[1]]
    };
  }

  private addMarkerSource(): void {
    this.map.addSource('point', {
      "type": "geojson",
      "data": this.pointPosition(this.routeData[0])
      });
  }

  private addMarkerLayer(): void {
    this.map.addLayer({
      "id": "point",
      "source": "point",
      "type": "circle",
      "paint": {
        "circle-radius": 10,
        "circle-color": "#ffa35c"
      }
    });
  }

  private addLineLayer(): void {
    this.map.addLayer({
      "id": "park-boundary",
      "type": "fill",
      "source": "national-park",
      "paint": {
      "fill-color": "#888888",
      "fill-opacity": 0.4
      },
      "filter": ["==", "$type", "Polygon"]
      });
       
      this.map.addLayer({
      "id": "park-volcanoes",
      "type": "circle",
      "source": "national-park",
      "paint": {
      "circle-radius": 6,
      "circle-color": "#B42222"
      },
      "filter": ["==", "$type", "Point"],
      });

      this.map.addLayer({
        "id": "park-lines",
        "type": "line",
        "source": "national-park",
        "paint": {
          "line-color": "#ffa35c",
          "line-width": 8
        },
        "filter": ["==", "$type", "LineString"],
        });      
  }

  private addLineSource(): void {
    console.log(1223, data1.features.map(each => each));
    this.map.addSource("national-park", {
      "type": "geojson",
      "data": {
      "type": "FeatureCollection",
      "features": []
      }
      });
  }

}