require 'pry'
names = ["Agricultural Engineering Bldg", "Army ROTC Bldg", "Arnold House", "(Studio) Arts Building", "Auxilary Services Warehouse", "Baker House (offices)", "Bartlett Hall", "Berkshire House", "Berkshire Dining Common", "Blaisdell", "Bowditch Hall", "Bowditch Lodge", "Boyden", "Brett (Offices)", "Campus Center", "Cance (offices)", "Central Heating Plant", "Chancellors House", "Chenoweth Laboratory", "Clark Hall", "(William S.) Clark International Center (Hills)", "Commonwealth Honors College", "Communication Disorders", "Computer Science Bldg", "Condensate Storage Building", "Conte Polymer Center", "Continuing Education", "Curry Hicks", "Dickinson Hall", "Draper Hall", "East Experiment Station", "Engineering Laboratory", "Engineering Laboratory II (E Lab II)", "Faculty Club", "Farley Lodge", "Fernald Hall", "Fine Arts Center (East)", "Fine Arts Center (West)", "Flint Laboratory", "Franklin Dining common ", "French Hall", "Furcolo Hall", "Goessmann Laboratory", "Goodell Bldg", "Goodell Bldg (Graduate School)", "Goodell Bldg (Procurement)", "Gordon Hall", "Gunness Lab", "Hampden Dining Common", "Hampshire Dining Common", "Hampshire House", "Hasbrouck Laboratory", "Hatch Laboratory", "Health Center", "Herter Hall", "Hillel House", "Hills North", "Hills South", "Holdsworth Hall", "Isenberg School of Management", "Integrated Science Building", "John Quincy Adams Tower", "Johnson House (offices)", "Knowles Engineering Bldg", "Lederle Grad Research Ctr (LGRC lowrise)", "Lederle Grad Research Tower (LGRT)", "Life Sciences Laboratories", "Machmer Hall", "Marcus Hall", "Marston Hall", "Mass Ventures", "Mather Building", "Memorial Hall", "Middlesex House", "Montague House", "Morrill 1", "Morrill 2", "Morrill 3", "Morrill 4", "Mullins Center", "Munson Hall", "Nelson House", "Nelson House II", "New Africa House", "Old Chapel", "Paige Laboratory", "Parking Office Trailer", "Parks Marching Band Building", "Photo Center", "Physical Plant", "Police Station", "Recreation Center", "Research Admininstration", "Renaissance Center", "Robsham Visitor's Center", "Shade Trees Laboratory", "Skinner Hall", "Slobody Bldg", "Slobody Bldg", "South College", "Stonewall Center", "Stockbridge Hall", "Student Union", "Thompson Hall", "Thoreau House (offices)", "Tillson House", "Tillson Farm", "Tobin Hall", "Toddler House", "Totman Bldg", "University Bus Garage", "University Press", "University Store", "W.E.B. Du Bois Library", "West Experiment Station", "Whitmore Bldg", "Wilder Hall", "Worcester Dining Commons", "Wysocki House", "Baker Hall", "Birch Hall", "Brett Hall", "Brooks Hall", "Brown Hall", "Butterfield Hall", "Cance Hall", "Cashin Hall", "Chadbourne Hall", "Coolidge Hall", "Crabtree Hall", "Crampton Hall", "Dickinson Hall", "Dwight Hall", "Elm Hall", "Emerson Hall", "Field Hall", "Gorman Hall", "Grayson Hall", "Greenough Hall", "Hamlin Hall", "James Hall", "John Adams Hall", "John Quincy Adams Hall", "Johnson Hall", "Kennedy Hall", "Knowlton Hall", "Leach Hall", "Lewis Hall", "Lincoln Apts", "Linden Hall", "Mackimmie Hall", "Maple Hall", "Mary Lyon Hall", "McNamara Hall", "Melville Hall", "Moore Hall", "North Residence A", "North Residence B", "North Residence C", "North Residence D", "North Village Apts. (family housing)", "Oak Hall", "Patterson Hall", "Pierpont Hall", "Prince Hall", "Sycamore Hall", "Thatcher Hall", "Thoreau Hall", "Van Meter Hall", "Washington Hall", "Webster Hall", "Wheeler Hall"]

api_key_mapquest = "Fmjtd%7Cluubn16rn9%2Caw%3Do5-90a5h6"

addresses =
"250 NATURAL RESOURCES RD, AMHERST, MA 01003
101 COMMONWEALTH AVE, AMHERST, MA 01003
715 N PLEASANT, AMHERST, MA 01003
110 THATCHER RD, AMHERST, MA 01003
31 COLD STORAGE DR, AMHERST, MA 01003
160 CLARK HILL RD OFC, AMHERST, MA 01003
130 HICKS WAY, AMHERST, MA 01003
121 COUNTY CIR, AMHERST, MA 01003
121 SOUTHWEST CIR, AMHERST, MA 01003
113 GRINNELL WAY, AMHERST, MA 01003
201 NATURAL RESOURCES RD, AMHERST, MA 01003
31 CLUBHOUSE DR, AMHERST, MA 01003
131 COMMONWEALTH AVE, AMHERST, MA 01003
151 INFIRMARY WAY OFC, AMHERST, MA 01003
1 CAMPUS CENTER WAY, AMHERST, MA 01003
191 FEARING OFC, AMHERST, MA 01003
200 MULLINS WAY, AMHERST, MA 01003
150 CHANCELLORS DR, AMHERST, MA 01003
100 HOLDSWORTH WAY, AMHERST, MA 01003
251 STOCKBRIDGE RD, AMHERST, MA 01003
111 THATCHER RD OFC 3, AMHERST, MA 01003
157 COMMONWEALTH AVE, AMHERST, MA 01003
358 N PLEASANT ST, AMHERST, MA 01003
140 GOVERNORS DR, AMHERST, MA 01003
30 CAMPUS CENTER SERVICE RD, AMHERST, MA 01003
120 GOVERNORS DR, AMHERST, MA 01003
100 VENTURE WAY, SUITE 201, HADLEY MA, AMHERST, MA 01003
100 HICKS WAY, AMHERST, MA 01003
155 HICKS WAY, AMHERST, MA 01003
40 CAMPUS CENTER WAY, AMHERST, MA 01003
671 N PLEASANT ST, AMHERST, MA 01003
160 GOVERNORS DR, AMHERST, MA 01003
101 NORTH SERVICE RD, AMHERST, MA 01003
243 STOCKBRIDGE RD, AMHERST, MA 01003
41 CLUBHOUSE DR, AMHERST, MA 01003
270 STOCKBRIDGE RD, AMHERST, MA 01003
151 PRESIDENTS DR OFC 1, AMHERST, MA 01003
151 PRESIDENTS DR OFC 2, AMHERST, MA 01003
90 CAMPUS CENTER WAY, AMHERST, MA 01003
260 STOCKBRIDGE RD, AMHERST, MA 01003
230 STOCKBRIDGE RD, AMHERST, MA 01003
813 N PLEASANT ST, AMHERST, MA 01003
686 N PLEASANT ST, AMHERST, MA 01003
140 HICKS WAY, AMHERST, MA 01003
140 HICKS WAY OFC 1, AMHERST, MA 01003
140 HICKS WAY OFC 2, AMHERST, MA 01003
418 N PLEASANT ST, AMHERST, MA 01002
121 NATURAL RESOURCES RD, AMHERST, MA 01003
131 SOUTHWEST CIR , AMHERST, MA 01003
141 SOUTHWEST CIR, AMHERST, MA 01003
131 COUNTY CIR, AMHERST, MA 01003
666 N PLEASANT ST, AMHERST, MA 01003
140 HOLDSWORTH WAY, AMHERST, MA 01003
150 INFIRMARY WAY, AMHERST, MA 01003
161 PRESIDENTS DR, AMHERST, MA 01003
388 NO PLEASANT ST #15, AMHERST, MA 01002
111 THATCHER RD OFC 1, AMHERST, MA 01003
111 THATCHER RD OFC 2, AMHERST, MA 01003
160 HOLDSWORTH WAY, AMHERST, MA 01003
121 PRESIDENTS DR, AMHERST, MA 01003
661 N PLEASANT ST, AMHERST, MA 01003
171 FEARING ST OFC, AMHERST, MA 01003
380 THATCHER RD OFC, AMHERST, MA 01003
151 HOLDSWORTH WAY, AMHERST, MA 01003
740 N PLEASANT ST, AMHERST, MA 01003
710 N PLEASANT ST, AMHERST, MA 01003
240 THATCHER RD, AMHERST, MA 01003
240 HICKS WAY, AMHERST, MA 01003
100 NATURAL RESOURCES RD, AMHERST, MA 01003
130 NATURAL RESOURCES RD, AMHERST, MA 01003
100 VENTURE WAY (HADLEY, MA), AMHERST, MA 01003
37 MATHER DR, AMHERST, MA 01003
134 HICKS WAY, AMHERST, MA 01003
111 COUNTY CIR, AMHERST, MA 01003
809 N PLEASANT ST, AMHERST, MA 01003
637 N PLEASANT ST, AMHERST, MA 01003
627 N PLEASANT ST, AMHERST, MA 01003
611 N PLEASANT ST, AMHERST, MA 01003
639 N PLEASANT ST, AMHERST, MA 01003
200 COMMONWEALTH AVE, AMHERST, MA 01003
101 HICKS WAY, AMHERST, MA 01003
513 EAST PLEASANT ST, AMHERST, MA 01003
505 EAST PLEASANT ST, AMHERST, MA 01003
180 INFIRMARY WAY, AMHERST, MA 01003
144 HICKS WAY, AMHERST, MA 01003
161 HOLDSWORTH WAY, AMHERST, MA 01003
51 FORESTRY WAY, AMHERST, MA 01003
110 Grinnell Way, AMHERST, MA 01003
211 HICKS WAY, AMHERST, MA 01003
360 CAMPUS CENTER WAY, AMHERST, MA 01003
585 EAST PLEASANT ST, AMHERST, MA 01003
161 COMMONWEALTH AVE, AMHERST, MA 01003
70 BUTTERFIELD TERR, AMHERST, MA 01003
650 E PLEASANT ST, AMHERST, MA 01001
300 MASSACHUSETTS AVE, AMHERST, MA 01003
245 STOCKBRIDGE RD, AMHERST, MA 01003
651 N PLEASANT ST, AMHERST, MA 01003
101 UNIVERSITY DR SUITE B, AMHERST, MA 01002
101 UNIVERSITY DR SUITE C, AMHERST, MA 01002
150 HICKS WAY, AMHERST, MA 01003
256 SUNSET AVE OFC, AMHERST, MA 01003
80 CAMPUS CENTER WAY, AMHERST, MA 01003
41 CAMPUS CENTER WAY, AMHERST, MA 01003
200 HICKS WAY, AMHERST, MA 01003
640 MASSACHUSETTS AVE OFC, AMHERST, MA 01003
23 TILLSON FARM RD, AMHERST, MA 01003
151 TILLSON FARM RD, AMHERST, MA 01003
135 HICKS WAY, AMHERST, MA 01003
21 CLUBHOUSE DR, AMHERST, MA 01003
30 EASTMAN LN, AMHERST, MA 01003
255 GOVERNORS DR, AMHERST, MA 01003
671 N PLEASANT ST, AMHERST, MA 01003
1 CAMPUS CENTER WAY OFC, AMHERST, MA 01003
154 HICKS WAY, AMHERST, MA 01003
682 N PLEASANT ST, AMHERST, MA 01003
181 PRESIDENTS DR, AMHERST, MA 01003
221 STOCKBRIDGE RD, AMHERST, MA 01003
669 N PLEASANT ST, AMHERST, MA 01003
911 N PLEASANT ST, AMHERST, MA 01003
160 CLARK HILL RD, AMHERST, MA 01003
153 COMMONWEALTH AVE, AMHERST, MA 01003
151 INFIRMARY WAY, AMHERST, MA 01003
160 INFIRMARY WAY, AMHERST, MA 01003
92 EASTMAN LN, AMHERST, MA 01003
171 CLARK HILL RD, AMHERST, MA 01003
191 FEARING ST, AMHERST, MA 01003
112 EASTMAN LN, AMHERST, MA 01003
110 ORCHARD HILL DR, AMHERST, MA 01003
630 MASSACHUSETTS AVE, AMHERST, MA 01003
17 EASTMAN LN, AMHERST, MA 01003
256 SUNSET AVE, AMHERST, MA 01003
151 ORCHARD HILL DR, AMHERST, MA 01003
41 EASTMAN LN, AMHERST, MA 01003
145 COMMONWEALTH AVE, AMHERST, MA 01003
151 SOUTHWEST CIR, AMHERST, MA 01003
171 ORCHARD HILL DR, AMHERST, MA 01003
90 BUTTERFIELD TER, AMHERST, MA 01003
161 ORCHARD HILL DR, AMHERST, MA 01003
120 ORCHARD HILL DR, AMHERST, MA 01003
739 N PLEASANT ST, AMHERST, MA 01003
660 MASSACHUSETTS AVE, AMHERST, MA 01003
161 FEARING ST, AMHERST, MA 01003
171 FEARING ST, AMHERST, MA 01003
380 THATCHER RD, AMHERST, MA 01003
620 MASSACHUSETTS AVE, AMHERST, MA 01003
691 N PLEASANT ST, AMHERST, MA 01003
21 EASTMAN LN, AMHERST, MA 01003
340 THATCHER RD, AMHERST, MA 01003
345 LINCOLN AVE, AMHERST, MA 01002
141 COMMONWEALTH AVE, AMHERST, MA 01003
230 SUNSET AVE, AMHERST, MA 01003
151 COMMONWEALTH AVE, AMHERST, MA 01003
43 EASTMAN LN, AMHERST, MA 01003
102 EASTMAN LN, AMHERST, MA 01003
650 MASSACHUSETTS AVE, AMHERST, MA 01003
111 SOUTHWEST CIR, AMHERST, MA 01003
56 EASTMAN LN, AMHERST, MA 01003
58 EASTMAN LN, AMHERST, MA 01003
54 EASTMAN LN, AMHERST, MA 01003
52 EASTMAN LN, AMHERST, MA 01003
990 N PLEASANT ST, AMHERST, MA 01002
143 COMMONWEALTH AVE, AMHERST, MA 01003
204 SUNSET AVE, AMHERST, MA 01003
201 FEARING ST, AMHERST, MA 01003
286 SUNSET AVE, AMHERST, MA 01003
159 COMMONWEALTH AVE, AMHERST, MA 01003
300 THATCHER RD, AMHERST, MA 01003
640 MASSACHUSETTS AVE, AMHERST, MA 01003
180 CLARK HILL RD, AMHERST, MA 01003
181 FEARING ST, AMHERST, MA 01003
141 ORCHARD HILL DR, AMHERST, MA 01003
171 INFIRMARY WAY, AMHERST, MA 01003"

locations =
"-72.527971, 42.394359
-72.53096, 42.385207
-72.52634, 42.394078
-72.524083, 42.39561
-72.535342, 42.393771
-72.519304, 42.388893
-72.530162, 42.390441
-72.527341, 42.385526
-72.530219, 42.382692
-72.5317, 42.3899
-72.528281, 42.394465
-72.534351, 42.381307
-72.532009, 42.38821
-72.521006, 42.388897
-72.532499, 42.39033
-72.529198, 42.381031
-72.537219, 42.38765
-72.5212, 42.391113
-72.529978, 42.391464
-72.523299, 42.388858
-72.524036, 42.395571
-72.532879, 42.390313
-72.520637, 42.383146
-72.532089, 42.39553
-72.532301, 42.390403
-72.529569, 42.39527
-72.519422, 42.403108
-72.529749, 42.390661
-72.530418, 42.390215
-72.532233, 42.390428
-72.525553, 42.39239
-72.532381, 42.395479
-72.5307, 42.3897
-72.523357, 42.3891
-72.53446, 42.381215
-72.523054, 42.388306
-72.526417, 42.38711
-72.526417, 42.38711
-72.531879, 42.390531
-72.523194, 42.388595
-72.52338, 42.389497
-72.527937, 42.397461
-72.525727, 42.392928
-72.530299, 42.390367
-72.530299, 42.390367
-72.530299, 42.390367
-72.52166, 42.385
-72.528691, 42.394704
-72.530237, 42.382891
-72.53031, 42.383073
-72.52755, 42.385541
-72.525495, 42.392205
-72.530225, 42.392851
-72.521007, 42.388908
-72.526306, 42.386798
-72.521169, 42.384103
-72.524036, 42.395571
-72.524036, 42.395571
-72.530677, 42.39347
-72.525484, 42.386486
-72.525444, 42.39202
-72.528379, 42.38125
-72.52365, 42.3936
-72.530434, 42.393208
-72.526689, 42.395072
-72.526225, 42.393883
-72.52365, 42.3936
-72.530878, 42.389532
-72.528719, 42.39481
-72.52868, 42.394658
-72.519422, 42.403108
-72.511359, 42.39479
-72.530217, 42.390411
-72.527259, 42.385353
-72.527832, 42.397181
-72.525235, 42.391122
-72.525166, 42.390746
-72.525055, 42.390144
-72.52525, 42.391197
-72.533928, 42.392653
-72.529763, 42.390654
-72.515463, 42.395844
-72.515499, 42.395617
-72.520947, 42.38858
-72.530354, 42.390338
-72.530707, 42.393498
-72.536308, 42.392388
-72.5317, 42.3899
-72.53081, 42.389848
-72.530255, 42.391389
-72.51566, 42.398346
-72.532979, 42.390535
-72.52064, 42.38721
-72.515466, 42.401895
-72.522549, 42.385831
-72.523346, 42.389039
-72.525342, 42.391647
-72.53326, 42.37031
-72.53326, 42.37031
-72.530409, 42.390277
-72.528288, 42.382693
-72.531951, 42.390513
-72.532226, 42.390431
-72.530626, 42.389868
-72.52961, 42.384851
-72.514633, 42.398462
-72.51259, 42.39886
-72.53023, 42.390404
-72.534214, 42.381374
-72.526289, 42.39552
-72.533861, 42.395186
-72.525553, 42.39239
-72.532499, 42.39033
-72.530416, 42.390227
-72.52567, 42.392763
-72.526054, 42.386106
-72.523383, 42.389773
-72.52553, 42.392316
-72.527954, 42.400984
-72.519304, 42.388893
-72.532776, 42.390077
-72.521006, 42.388897
-72.520991, 42.388798
-72.520164, 42.397267
-72.519016, 42.388996
-72.529198, 42.381031
-72.519276, 42.397374
-72.519043, 42.389927
-72.529382, 42.384793
-72.526558, 42.395438
-72.528288, 42.382693
-72.519599, 42.392498
-72.525208, 42.395769
-72.532485, 42.389381
-72.530571, 42.383097
-72.518328, 42.392768
-72.520688, 42.387543
-72.519061, 42.392624
-72.519649, 42.39059
-72.526689, 42.39507
-72.530068, 42.38496
-72.527969, 42.38136
-72.528379, 42.38125
-72.52365, 42.3936
-72.529147, 42.384757
-72.525814, 42.393131
-72.526468, 42.395465
-72.52365, 42.3936
-72.526606, 42.383729
-72.532338, 42.389022
-72.528146, 42.3821
-72.532669, 42.389832
-72.525018, 42.39583
-72.519718, 42.397313
-72.529838, 42.384908
-72.530219, 42.38251
-72.523665, 42.396403
-72.523365, 42.39665
-72.524012, 42.396193
-72.524409, 42.39604
-72.52925, 42.40345
-72.532412, 42.389201
-72.527993, 42.38146
-72.529529, 42.38094
-72.528617, 42.383845
-72.532929, 42.390424
-72.52365, 42.3936
-72.52961, 42.384851
-72.518781, 42.389081
-72.528788, 42.38114
-72.520155, 42.392037
-72.52097, 42.388678"

buildings = []
addresses_array = addresses.split(/\n/)
locations_array = locations.split(/\n/)
(0..171).each do |i|
  lat, long = locations_array[i].split(', ')
  buildings << {id: i, name: names[i], latitude: lat, longitude: long, address: addresses.split(/\n/)[i]}
end
require 'json'
result = JSON.pretty_generate(buildings)

File.open('./buildings_complete.json', 'w+') do |f|
  f.write(result)
end