-- menu_items tablosuna sort_order sütunu ekle
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- Mevcut ürünlere otomatik sıra numarası ver (created_at sırasına göre)
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) * 10 AS new_order
  FROM menu_items
)
UPDATE menu_items
SET sort_order = numbered.new_order
FROM numbered
WHERE menu_items.id = numbered.id;
