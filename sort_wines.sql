WITH sorted_wines AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY price DESC) * 10 AS new_order
  FROM menu_items
  WHERE category_id = 'sarap'
)
UPDATE menu_items
SET sort_order = sorted_wines.new_order
FROM sorted_wines
WHERE menu_items.id = sorted_wines.id;
