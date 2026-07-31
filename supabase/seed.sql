-- Bizmi — starter catalog seed data
-- Run after the init migration. Safe to re-run (upserts on slug/sku).

insert into categories (slug, name, name_ur, description, color, order_index) values
  ('robotics-kits', 'Robotics kits', null, 'Complete beginner-to-advanced build kits', 'orange', 1),
  ('arduino', 'Arduino', null, 'UNO, Nano, Mega, and more', 'blue', 2),
  ('raspberry-pi', 'Raspberry Pi', null, 'Pi 5, Pi 4, Zero, Pico', 'red', 3),
  ('stm32', 'STM32', null, 'Blue Pill, Nucleo, Discovery', 'purple', 4),
  ('sensors', 'Sensors & shields', null, 'Displays, motion, comms, prototyping', 'green', 5)
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, color = excluded.color, order_index = excluded.order_index;

-- Robotics kits
insert into products (slug, sku, name, short_description, category_id, brand, product_type, price_pkr, compare_at_price_pkr, age_min, age_max, difficulty, featured, is_bestseller, is_new, inventory_count, is_active) values
  ('bizmi-robotics-electronics-kit', 'BZ-KIT-001', 'Bizmi Robotics & Electronics Kit', 'The flagship starter kit — everything a first-time builder needs.', (select id from categories where slug='robotics-kits'), 'Bizmi', 'physical', 8500, 9500, 6, 10, 'beginner', true, true, false, 40, true),
  ('line-follower-bot-kit', 'BZ-KIT-002', 'Line Follower Bot Kit', 'Build a robot that tracks a line using IR sensors.', (select id from categories where slug='robotics-kits'), 'Bizmi', 'physical', 4200, null, 9, 14, 'beginner', false, false, false, 25, true),
  ('bluetooth-rover-kit', 'BZ-KIT-003', 'Bluetooth Rover Kit', 'A phone-controlled rover you build and code yourself.', (select id from categories where slug='robotics-kits'), 'Bizmi', 'physical', 5600, null, 10, 15, 'intermediate', false, false, true, 18, true),
  ('obstacle-avoiding-robot-kit', 'BZ-KIT-004', 'Obstacle Avoiding Robot Kit', 'Ultrasonic-sensor robot that dodges obstacles in real time.', (select id from categories where slug='robotics-kits'), 'Bizmi', 'physical', 4800, null, 9, 14, 'beginner', false, false, false, 22, true),
  ('robotic-arm-kit', 'BZ-KIT-005', 'Robotic Arm Kit', 'A 4-servo robotic arm kit for advanced builders.', (select id from categories where slug='robotics-kits'), 'Bizmi', 'physical', 7200, null, 12, 17, 'advanced', false, false, false, 12, true)
on conflict (slug) do nothing;

-- Arduino
insert into products (slug, sku, name, short_description, category_id, brand, product_type, price_pkr, compare_at_price_pkr, difficulty, featured, is_bestseller, is_new, inventory_count, is_active) values
  ('arduino-uno-r3', 'ARD-UNO-R3', 'Arduino UNO R3', 'The classic starting point for every Arduino project.', (select id from categories where slug='arduino'), 'Arduino', 'physical', 2200, 2600, 'beginner', true, true, false, 60, true),
  ('arduino-nano', 'ARD-NANO', 'Arduino Nano', 'Breadboard-friendly, same power as the UNO in a smaller footprint.', (select id from categories where slug='arduino'), 'Arduino', 'physical', 1800, null, 'beginner', false, false, false, 45, true),
  ('arduino-nano-esp32', 'ARD-NANO-ESP32', 'Arduino Nano ESP32', 'Nano form factor with built-in WiFi and Bluetooth.', (select id from categories where slug='arduino'), 'Arduino', 'physical', 3400, null, 'intermediate', true, false, true, 30, true),
  ('arduino-mega-2560', 'ARD-MEGA-2560', 'Arduino Mega 2560', 'More pins and memory for bigger projects.', (select id from categories where slug='arduino'), 'Arduino', 'physical', 3800, null, 'intermediate', false, false, false, 20, true),
  ('arduino-leonardo', 'ARD-LEO', 'Arduino Leonardo', 'Native USB support — great for HID projects.', (select id from categories where slug='arduino'), 'Arduino', 'physical', 2900, null, 'intermediate', false, false, false, 15, true)
on conflict (slug) do nothing;

-- Raspberry Pi
insert into products (slug, sku, name, short_description, category_id, brand, product_type, price_pkr, compare_at_price_pkr, difficulty, featured, is_bestseller, is_new, inventory_count, is_active) values
  ('raspberry-pi-5-8gb', 'RPI-5-8GB', 'Raspberry Pi 5 (8GB)', 'The fastest Raspberry Pi yet — a full desktop-class computer.', (select id from categories where slug='raspberry-pi'), 'Raspberry Pi', 'physical', 22500, null, 'intermediate', true, true, true, 15, true),
  ('raspberry-pi-4-4gb', 'RPI-4-4GB', 'Raspberry Pi 4 (4GB)', 'Reliable, well-supported, and still a great choice.', (select id from categories where slug='raspberry-pi'), 'Raspberry Pi', 'physical', 15500, 17000, 'intermediate', false, true, false, 25, true),
  ('raspberry-pi-zero-2-w', 'RPI-ZERO2W', 'Raspberry Pi Zero 2 W', 'Tiny, WiFi-enabled, perfect for compact builds.', (select id from categories where slug='raspberry-pi'), 'Raspberry Pi', 'physical', 3200, null, 'intermediate', false, false, false, 30, true),
  ('raspberry-pi-pico-w', 'RPI-PICO-W', 'Raspberry Pi Pico W', 'A $4 microcontroller with WiFi built in.', (select id from categories where slug='raspberry-pi'), 'Raspberry Pi', 'physical', 1450, null, 'beginner', true, false, false, 50, true),
  ('raspberry-pi-camera-module-3', 'RPI-CAM3', 'Raspberry Pi Camera Module 3', 'Autofocus 12MP camera for Pi vision projects.', (select id from categories where slug='raspberry-pi'), 'Raspberry Pi', 'physical', 6800, null, 'intermediate', false, false, true, 18, true)
on conflict (slug) do nothing;

-- STM32
insert into products (slug, sku, name, short_description, category_id, brand, product_type, price_pkr, compare_at_price_pkr, difficulty, featured, is_bestseller, is_new, inventory_count, is_active) values
  ('stm32-blue-pill', 'STM32-BP', 'STM32 Blue Pill', 'The cheapest way into ARM Cortex-M development.', (select id from categories where slug='stm32'), 'STM32', 'physical', 950, null, 'advanced', true, false, false, 40, true),
  ('stm32-black-pill', 'STM32-BLKP', 'STM32 Black Pill', 'A faster, more capable successor to the Blue Pill.', (select id from categories where slug='stm32'), 'STM32', 'physical', 1250, null, 'advanced', false, false, false, 25, true),
  ('stm32-nucleo-f446re', 'STM32-NUCLEO-F446RE', 'STM32 Nucleo-F446RE', 'ST''s official dev board with on-board debugger.', (select id from categories where slug='stm32'), 'STM32', 'physical', 4200, null, 'advanced', true, false, true, 15, true),
  ('stm32-discovery-f407vg', 'STM32-DISC-F407VG', 'STM32 Discovery F407VG', 'Discovery kit with accelerometer and audio DAC on board.', (select id from categories where slug='stm32'), 'STM32', 'physical', 5600, null, 'advanced', false, false, false, 10, true),
  ('st-link-v2-programmer', 'STM32-STLINKV2', 'ST-Link V2 Programmer', 'The programmer/debugger every STM32 board needs.', (select id from categories where slug='stm32'), 'STM32', 'physical', 850, null, 'advanced', false, false, false, 35, true)
on conflict (slug) do nothing;

-- Sensors & shields
insert into products (slug, sku, name, short_description, category_id, brand, product_type, price_pkr, compare_at_price_pkr, difficulty, featured, is_bestseller, is_new, inventory_count, is_active) values
  ('hc-sr04-ultrasonic-sensor', 'SEN-HCSR04', 'HC-SR04 Ultrasonic Sensor', 'Measure distance from 2cm to 400cm.', (select id from categories where slug='sensors'), 'Generic', 'physical', 250, null, 'beginner', true, true, false, 100, true),
  ('dht22-temp-humidity-sensor', 'SEN-DHT22', 'DHT22 Temperature & Humidity Sensor', 'Accurate climate sensing for weather stations.', (select id from categories where slug='sensors'), 'Generic', 'physical', 450, null, 'beginner', false, false, false, 60, true),
  ('mpu6050-imu', 'SEN-MPU6050', 'MPU6050 IMU', '6-axis accelerometer + gyroscope module.', (select id from categories where slug='sensors'), 'Generic', 'physical', 380, null, 'intermediate', false, false, false, 50, true),
  ('hc-05-bluetooth-module', 'SEN-HC05', 'HC-05 Bluetooth Module', 'Add wireless control to any Arduino project.', (select id from categories where slug='sensors'), 'Generic', 'physical', 550, null, 'beginner', true, false, false, 45, true),
  ('neo-6m-gps-module', 'SEN-NEO6M', 'NEO-6M GPS Module', 'Add location tracking to your build.', (select id from categories where slug='sensors'), 'Generic', 'physical', 950, null, 'intermediate', false, false, false, 30, true),
  ('l298n-motor-driver', 'SEN-L298N', 'L298N Motor Driver', 'Drive two DC motors from a microcontroller.', (select id from categories where slug='sensors'), 'Generic', 'physical', 320, null, 'beginner', true, true, false, 70, true),
  ('lcd-16x2-display', 'SEN-LCD1602', '16x2 LCD Display', 'Classic character display for status and menus.', (select id from categories where slug='sensors'), 'Generic', 'physical', 400, null, 'beginner', false, false, false, 55, true),
  ('sg90-micro-servo', 'SEN-SG90', 'SG90 Micro Servo', 'A small, reliable servo for robotics builds.', (select id from categories where slug='sensors'), 'Generic', 'physical', 280, null, 'beginner', false, true, false, 90, true)
on conflict (slug) do nothing;
