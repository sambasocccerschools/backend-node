CREATE OR REPLACE VIEW monthly_members_summary AS
SELECT 
    DATE_FORMAT(m.created_date, '%Y-%m') AS month,
    COUNT(m.id) AS total_members,
    SUM(sp.monthly_subscription_fee) AS total_revenue,
    AVG(sp.monthly_subscription_fee) AS avg_monthly_fee,
    AVG(TIMESTAMPDIFF(MONTH, m.start_date, NOW())) AS avg_lifecycle,
    COUNT(DISTINCT m.student) AS total_students
FROM weekly_classes_members m
JOIN subscription_plan_prices sp ON m.subscription_plan_price = sp.id
JOIN units_dynamic_central udc ON m.member_status = udc.code
WHERE m.is_deleted = 0
AND udc.code NOT IN ('PAY_PENDING_MS', 'FROZEN_MS', 'CANCELLED_MS')  -- Excluir miembros inactivos
GROUP BY month;




DROP PROCEDURE IF EXISTS get_members_report;

DELIMITER $$

CREATE PROCEDURE get_members_report(
    IN start_date DATE,
    IN end_date DATE,
    IN venue_filter VARCHAR(255),
    IN class_filter VARCHAR(255)
)
BEGIN
    -- Actual Month
    SELECT 
        curr.month AS current_month,
        curr.total_members AS total_members_current,
        prev.total_members AS total_members_prev,
        ((curr.total_members - prev.total_members) / NULLIF(prev.total_members, 0)) * 100 AS members_growth_percent,
        curr.total_revenue AS revenue_current,
        prev.total_revenue AS revenue_prev,
        ((curr.total_revenue - prev.total_revenue) / NULLIF(prev.total_revenue, 0)) * 100 AS revenue_growth_percent,
        curr.avg_monthly_fee AS avg_fee_current,
        prev.avg_monthly_fee AS avg_fee_prev,
        ((curr.avg_monthly_fee - prev.avg_monthly_fee) / NULLIF(prev.avg_monthly_fee, 0)) * 100 AS avg_fee_growth_percent,
        curr.avg_lifecycle AS avg_lifecycle_current,
        prev.avg_lifecycle AS avg_lifecycle_prev,
        ((curr.avg_lifecycle - prev.avg_lifecycle) / NULLIF(prev.avg_lifecycle, 0)) * 100 AS lifecycle_growth_percent,
        curr.total_students AS total_students_current,
        prev.total_students AS total_students_prev,
        ((curr.total_students - prev.total_students) / NULLIF(prev.total_students, 0)) * 100 AS students_growth_percent
    FROM monthly_members_summary curr
    LEFT JOIN monthly_members_summary prev 
        ON DATE_FORMAT(DATE_SUB(curr.month, INTERVAL 1 MONTH), '%Y-%m') = prev.month
    WHERE curr.month BETWEEN DATE_FORMAT(start_date, '%Y-%m') AND DATE_FORMAT(end_date, '%Y-%m')
    AND (venue_filter IS NULL OR curr.venue = venue_filter)
    AND (class_filter IS NULL OR curr.class_id = class_filter);
END $$

DELIMITER ;




