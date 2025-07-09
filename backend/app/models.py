from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    # One-to-One ilişki: Her çalışanın bir cihazı olabilir
    device = relationship("Device", back_populates="employee", uselist=False) 

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String, index=True)
    ip_address = Column(String, index=True)
    mac_address = Column(String, unique=True, index=True)

    # Employee ile ilişki
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    employee = relationship("Employee", back_populates="device")