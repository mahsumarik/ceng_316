INSERT  IGNORE  INTO student_affairs ( id,first_name, last_name, email, phone, role)
VALUES ( 1,'Ahmet', 'Yildirim', 'ahmetyildirim@iyte.edu.tr', '+905301234567', 'STUDENT_AFFAIRS');

INSERT IGNORE INTO deans (id, email, first_name, last_name, phone, role, faculty)
VALUES
    (2, 'mehmetkara@iyte.edu.tr', 'Mehmet', 'Kara', '+905321234567', 'DEAN', 'Science'),
    (3, 'ayseozturk@iyte.edu.tr', 'Ayse', 'Ozturk', '+905331234567', 'DEAN', 'Engineering'),
    (4, 'alidemir@iyte.edu.tr', 'Ali', 'Demir', '+905341234567', 'DEAN', 'Architecture');


INSERT IGNORE  INTO secretaries (id, first_name, last_name, email, phone, role, department, faculty)
VALUES
    (5, 'Mehmet', 'Polat', 'mehmetpolat@iyte.edu.tr', '+905578197020', 'SECRETARY', 'ComputerEngineering', 'Engineering'),
    (6, 'Ayse', 'Yilmaz', 'ayseyilmaz@iyte.edu.tr', '+905168484497', 'SECRETARY', 'Physics', 'Science'),
    (7, 'Emre', 'Celik', 'emrecelik@iyte.edu.tr', '+905776181051', 'SECRETARY', 'Architecture', 'Architecture'),
    (8, 'Emre', 'Sahin', 'emresahin@iyte.edu.tr', '+905394195730', 'SECRETARY', 'MechanicalEngineering', 'Engineering');

INSERT IGNORE INTO advisors (id, email, first_name, last_name, phone, role, department, faculty)
VALUES
    (9, 'emreguler@iyte.edu.tr', 'Emre', 'Guler', '+905752768682', 'ADVISOR', 'ComputerEngineering', 'Engineering'),
    (10, 'elifguler@iyte.edu.tr', 'Elif', 'Guler', '+905849958434', 'ADVISOR', 'ComputerEngineering', 'Engineering'),
    (11, 'mahsumcelik@iyte.edu.tr', 'Mahsum', 'Celik', '+905692836454', 'ADVISOR', 'Physics', 'Science'),
    (12, 'ayseaksoy@iyte.edu.tr', 'Ayse', 'Aksoy', '+905342517717', 'ADVISOR', 'Architecture', 'Architecture'),
    (13, 'muratyilmaz@iyte.edu.tr', 'Murat', 'Yilmaz', '+905174228896', 'ADVISOR', 'MechanicalEngineering', 'Engineering');


INSERT IGNORE INTO students (id, first_name, last_name, email, phone, role, student_number, department, faculty, enrollment_date, graduation_status, gpa, advisor_id, ects_earned, advisor_status, dean_status, secretary_status, student_affair_status)
VALUES
    (21, 'Mahsum', 'Arık', 'mahsumarik@std.iyte.edu.tr', '905434198634', 'STUDENT', '290201080', 'ComputerEngineering', 'Engineering', '03.10.2021', False, 3.19, 9, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (22, 'Gokhan', 'Kurtulus', 'gokhankurtulus@std.iyte.edu.tr', '905906196796', 'STUDENT', '270248893', 'ComputerEngineering', 'Engineering', '19.08.2018', False, 3.46, 9, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (23, 'Alperen', 'Balci', 'alperenbalci@std.iyte.edu.tr', '905441755098', 'STUDENT', '280912418', 'ComputerEngineering', 'Engineering', '26.07.2017', False, 2.03, 9, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (24, 'Fatma', 'Ozturk', 'fatmaozturk@std.iyte.edu.tr', '905973325959', 'STUDENT', '280695468', 'ComputerEngineering', 'Engineering', '07.12.2020', False, 3.88, 9, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (25, 'Irem', 'Yilmaz', 'i̇remyilmaz@std.iyte.edu.tr', '905163716437', 'STUDENT', '290409685', 'ComputerEngineering', 'Engineering', '17.09.2018', False, 3.01, 9, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (26, 'Omer', 'Koc', 'omerkoc@std.iyte.edu.tr', '905939353082', 'STUDENT', '260821324', 'ComputerEngineering', 'Engineering', '11.09.2021', False, 2.1, 9, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (27, 'Deniz', 'Bagci', 'denizbagci@std.iyte.edu.tr', '905481698049', 'STUDENT', '260124786', 'ComputerEngineering', 'Engineering', '15.04.2020', False, 2.28, 9, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (28, 'Emine', 'Kalkan', 'eminekalkan@std.iyte.edu.tr', '905931716772', 'STUDENT', '280312323', 'ComputerEngineering', 'Engineering', '07.10.2017', False, 1.14, 9, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (29, 'Gulsum', 'Simsek', 'gulsumsimsek@std.iyte.edu.tr', '905111788663', 'STUDENT', '280445717', 'ComputerEngineering', 'Engineering', '25.04.2017', False, 2.85, 10, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (30, 'Aydin', 'Sahin', 'aydinsahin@std.iyte.edu.tr', '905744915962', 'STUDENT', '280514635', 'ComputerEngineering', 'Engineering', '13.12.2017', False, 2.39, 10, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (31, 'Emine', 'Balkan', 'eminebalkan@std.iyte.edu.tr', '905704769235', 'STUDENT', '280628619', 'ComputerEngineering', 'Engineering', '03.10.2016', False, 3.64, 10, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (32, 'Zeynep', 'Aydin', 'zeynepaydin@std.iyte.edu.tr', '905944115219', 'STUDENT', '270887297', 'ComputerEngineering', 'Engineering', '30.12.2016', False, 2.94, 10, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (33, 'Fikret', 'Tas', 'fikrettas@std.iyte.edu.tr', '905487071726', 'STUDENT', '290277227', 'ComputerEngineering', 'Engineering', '24.10.2020', False, 2.53, 10, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (34, 'Bora', 'Yuksel', 'borayuksel@std.iyte.edu.tr', '905526806521', 'STUDENT', '280717593', 'ComputerEngineering', 'Engineering', '28.04.2021', False, 2.53, 10, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (35, 'Hasan', 'Polat', 'hasanpolat@std.iyte.edu.tr', '905384877819', 'STUDENT', '270550769', 'ComputerEngineering', 'Engineering', '08.05.2020', False, 2.91, 10, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (36, 'Ayse', 'Bicakci', 'aysebicakci@std.iyte.edu.tr', '905691205525', 'STUDENT', '290829318', 'ComputerEngineering', 'Engineering', '11.09.2017', False, 3.68, 10, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (37, 'Kubra', 'Balci', 'kubrabalci@std.iyte.edu.tr', '905736982869', 'STUDENT', '290756989', 'Physics', 'Science', '07.04.2018', False, 3.68, 11, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (38, 'Eda', 'Polat', 'edapolat@std.iyte.edu.tr', '905701008786', 'STUDENT', '270361097', 'Physics', 'Science', '18.09.2017', False, 3.44, 11, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (39, 'Ozan', 'Aksoy', 'ozanaksoy@std.iyte.edu.tr', '905531848480', 'STUDENT', '270481089', 'Physics', 'Science', '05.07.2020', False, 2.42, 11, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (40, 'Irem', 'Pektas', 'i̇rempektas@std.iyte.edu.tr', '905142114965', 'STUDENT', '290330990', 'Physics', 'Science', '05.11.2018', False, 2.76, 11, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (41, 'Elif', 'Keskin', 'elifkeskin@std.iyte.edu.tr', '905228625989', 'STUDENT', '280623806', 'Physics', 'Science', '05.05.2021', False, 2.07, 11, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (42, 'Hikmet', 'Ucar', 'hikmetucar@std.iyte.edu.tr', '905326954450', 'STUDENT', '270260640', 'Physics', 'Science', '04.09.2017', False, 3.7, 11, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (42, 'Ugur', 'Suleyman', 'ugursuleyman@std.iyte.edu.tr', '905319648186', 'STUDENT', '290778418', 'Physics', 'Science', '21.04.2021', False, 2.64, 11, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (44, 'Gokhan', 'Zengin', 'gokhanzengin@std.iyte.edu.tr', '905208686465', 'STUDENT', '290688702', 'Physics', 'Science', '29.08.2018', False, 2.59, 11, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (45, 'Murat', 'Celik', 'muratcelik@std.iyte.edu.tr', '905621505497', 'STUDENT', '280907058', 'Architecture', 'Architecture', '26.05.2021', False, 3.0, 12, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (46, 'Melek', 'Ozturk', 'melekozturk@std.iyte.edu.tr', '905904728846', 'STUDENT', '260906034', 'Architecture', 'Architecture', '17.07.2019', False, 2.49, 12, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (47, 'Koray', 'Sari', 'koraysari@std.iyte.edu.tr', '905477198146', 'STUDENT', '280991660', 'Architecture', 'Architecture', '21.03.2017', False, 2.22, 12, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (48, 'Beyza', 'Kurtulus', 'beyzakurtulus@std.iyte.edu.tr', '905146741535', 'STUDENT', '280504034', 'Architecture', 'Architecture', '08.06.2019', False, 3.7, 12, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (49, 'Mehmet', 'Sahin', 'mehmetsahin@std.iyte.edu.tr', '905604101260', 'STUDENT', '260379422', 'Architecture', 'Architecture', '10.05.2017', False, 3.42, 12, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (50, 'Seda', 'Celik', 'sedacelik@std.iyte.edu.tr', '905584157050', 'STUDENT', '280422185', 'Architecture', 'Architecture', '06.03.2018', False, 2.54, 12, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (51, 'Serdar', 'Bozkurt', 'serdarbozkurt@std.iyte.edu.tr', '905515129368', 'STUDENT', '260166478', 'Architecture', 'Architecture', '11.12.2016', False, 3.64, 12, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (52, 'Tugba', 'Ari', 'tugbaari@std.iyte.edu.tr', '905168894137', 'STUDENT', '270862116', 'Architecture', 'Architecture', '09.01.2019', False, 1.71, 12, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (53, 'Berk', 'Aydin', 'berkaydin@std.iyte.edu.tr', '905901923611', 'STUDENT', '260312322', 'MechanicalEngineering', 'Engineering', '20.11.2019', False, 2.51, 13, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (54, 'Nesrin', 'Aydin', 'nesrinaydin@std.iyte.edu.tr', '905357892018', 'STUDENT', '270921386', 'MechanicalEngineering', 'Engineering', '14.08.2017', False, 2.98, 13, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (55, 'Meryem', 'Ozturk', 'meryemozturk@std.iyte.edu.tr', '905127644349', 'STUDENT', '290561847', 'MechanicalEngineering', 'Engineering', '17.11.2017', False, 3.65, 13, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (56, 'Serdar', 'Aydin', 'serdaraydin@std.iyte.edu.tr', '905939534774', 'STUDENT', '270290935', 'MechanicalEngineering', 'Engineering', '11.10.2016', False, 3.5, 13, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (57, 'Murat', 'Sahin', 'muratsahin@std.iyte.edu.tr', '905562682986', 'STUDENT', '280686654', 'MechanicalEngineering', 'Engineering', '06.01.2017', False, 2.99, 13, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (58, 'Berkay', 'Kaya', 'berkaykaya@std.iyte.edu.tr', '905713962642', 'STUDENT', '260808306', 'MechanicalEngineering', 'Engineering', '05.01.2018', False, 3.78, 13, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (59, 'Emre', 'Usta', 'emreusta@std.iyte.edu.tr', '905262264148', 'STUDENT', '260754005', 'MechanicalEngineering', 'Engineering', '01.10.2017', False, 2.01, 13, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING'),
    (60, 'Murat', 'Yilmaz', 'muratyilmaz@std.iyte.edu.tr', '905116887492', 'STUDENT', '270756553', 'MechanicalEngineering', 'Engineering', '15.11.2020', False, 1.52, 13, 132, 'PENDING', 'PENDING', 'PENDING', 'PENDING');



