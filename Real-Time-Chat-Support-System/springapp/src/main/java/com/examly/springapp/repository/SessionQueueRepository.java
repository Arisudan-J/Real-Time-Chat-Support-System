package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.SessionQueue;

public interface SessionQueueRepository extends JpaRepository<SessionQueue, Long> {
    List<SessionQueue> findByStatusOrderByPriorityDescQueueTimeAsc(SessionQueue.Status status);
}
