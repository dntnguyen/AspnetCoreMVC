﻿using CoreApp.Data.Enums;
using CoreApp.Data.Interfaces;
using CoreApp.Infrastructure.SharedKernels;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CoreApp.Data.Entities
{

    [Table("Announcements")]
    public class Announcement : DomainEntity<string>, ISwitchable, IDateTracking
    {
        public Announcement()
        {
            AnnouncementUsers = new List<AnnouncementUser>();
        }

        public Announcement(string title, string content, Guid userId, Status status)
        {
            Title = title;
            Content = content;
            UserId = userId;
            Status = status;
        }

        [Required]
        [StringLength(250)]
        public string Title { set; get; }

        [StringLength(250)]
        public string Content { set; get; }

        public Guid UserId { set; get; }

        [ForeignKey("UserId")]
        public virtual AppUser AppUser { get; set; }

        public virtual ICollection<AnnouncementUser> AnnouncementUsers { get; set; }
        public DateTime CreatedDate { set; get; }
        public DateTime? ModifiedDate { set; get; }
        public Status Status { set; get; }
    }

}