import React from 'react';
import { Card } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatisticsCard = ({ title, value, icon, color, trend, trendUp }) => {
  const getColorClass = () => {
    switch (color) {
      case 'primary': return 'text-primary';
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'danger': return 'text-danger';
      case 'info': return 'text-info';
      default: return 'text-primary';
    }
  };

  const getBgColorClass = () => {
    switch (color) {
      case 'primary': return 'bg-primary';
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'danger': return 'bg-danger';
      case 'info': return 'bg-info';
      default: return 'bg-primary';
    }
  };

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-2 fw-bold">{value}</h3>
            {trend && (
              <div className="d-flex align-items-center">
                {trendUp ? (
                  <FaArrowUp className="text-success me-1" size={12} />
                ) : (
                  <FaArrowDown className="text-danger me-1" size={12} />
                )}
                <small className={trendUp ? 'text-success' : 'text-danger'}>
                  {trend} from last month
                </small>
              </div>
            )}
          </div>
          <div className={`${getBgColorClass()} rounded-circle p-3`}>
            <div className={getColorClass()}>
              {icon}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatisticsCard;
